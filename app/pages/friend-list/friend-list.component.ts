import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {UserService} from "../../services/users/user.service";
import {NotificationsService} from "../../services/notifications/notifications.service";
import dialogs = require("ui/dialogs");
import {Page} from "ui/page";
var config = require("../../shared/config");

@Component({
  selector: "friend-list",
  providers: [UserService, NotificationsService],
  styleUrls: ['pages/friend-list/friend-list.component.css', 'app.css'],
  templateUrl: 'pages/friend-list/friend-list.component.html'
})

export class FriendListComponent implements OnInit{
  public _users = [];
  public _apiUrl:string;

  private confirmOptions = {
    title: "Unfried",
    message: "Unfried?",
    okButtonText: "Yes",
    cancelButtonText: "No"
  };

  constructor(
    private _notificationsService: NotificationsService,
    private _userService: UserService,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}

  ngOnInit() {
    this._apiUrl = config.apiUrl;
    this._userService.getFriendsList().subscribe(users =>{
      this._users = users;
    }, error => alert('Unable to get your friend list'));
  }
  
  public unfriendUser(user){
    this.confirmOptions.message = "Unfriend " + user.first_name + " " + user.last_name + "?";
    dialogs.confirm(this.confirmOptions).then((result: boolean) => {
      if(result){
        this._notificationsService.unfriendUser(user.id).subscribe(response => {
          alert(user.first_name + ' ' + user.last_name + ' is not your friend anymore');
          this.ngOnInit();
        }, error => { alert('Error when processing the request'); });
      }
    });
  }

  public goToAddUser():void{
    this.routerExtensions.navigate(["/search-user"], { animated: false });
  }
  
  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
