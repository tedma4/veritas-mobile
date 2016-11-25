import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {Subject} from 'rxjs/Subject';
import {UserService} from "../../services/users/user.service";
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import dialogs = require("ui/dialogs");
import {Page} from "ui/page";
var frameModule = require("ui/frame");
var config = require("../../shared/config");

@Component({
  selector: "search-user",
  providers: [UserService],
  styleUrls: ['pages/search-user/search-user.component.css', 'app.css'],
  templateUrl: 'pages/search-user/search-user.component.html'
})
export class SearchUserComponent implements OnInit{
  public searchResults = [];
  public _apiUrl:string;
  public searchValue:string;
  public subject = new Subject();
  public searchSubscription;

  private confirmOptions = {
    title: "Friend Request",
    message: "Send a friend request?",
    okButtonText: "Yes",
    cancelButtonText: "No"
  };

  constructor(
    private userService: UserService,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {
    this.searchSubscription = this.subject
        .debounceTime(1000)
        .subscribe((item) => {
          this.requestSearch(item);
        });
  }

  ngOnInit() {
    this._apiUrl = config.apiUrl;
  }
  
  private requestSearch(text){
    this.userService.searchUser(text).subscribe(users => {
      this.searchResults = users;
    }, error => { alert('Error when searching for users') });
  }

  
  public processFriendship(user:any){
    console.log(user.friendship_status);
    if(user.friendship_status != "Send Request"){ return; }
    this.confirmOptions.message = "Send friend request to " + user.first_name + "?";
    dialogs.confirm(this.confirmOptions).then((result: boolean) => {
      if(result){
        this.sendFriendRequest(user.id);
      }
    });
  }

  public sendFriendRequest(userId:string){
    this.userService.sendFriendRequest(userId).subscribe(response => {
      this.changeUserFriendship(userId);
    }, error => { alert('Error when sending request'); });
  }

  public changeUserFriendship(userId:string){
    if(this.searchResults && this.searchResults.length > 0){
      this.searchResults.map(user =>{
        if(user.id === userId){ user.friendship_status = "Request Sent";}
      });
    }
  }

  public onSearchValueChange(event){
    this.subject.next(this.searchValue);
  }

  public searchSubmit = (event) => {
    console.log('submit event ' + event);
  }

  public searchClear = (event) => {
    console.log('clear event');
  }
  
  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
