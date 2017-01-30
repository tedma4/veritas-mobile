import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular/router";
import {UserService} from "../../services/users/user.service";
import {PostService} from "../../services/post/post.service";
import {PostToSend} from "../../models/post-to-send";
import imageSource = require("image-source");
import {Page} from "ui/page";
import {Color} from "color";

@Component({
  selector: "post-user-selection",
  providers: [UserService],
  styleUrls: ['pages/post-user-selection/post-user-selection.component.css', 'app.css'],
  templateUrl: 'pages/post-user-selection/post-user-selection.component.html'
})

export class PostUserSelectionComponent implements OnInit{
  private postToSend:PostToSend;
  public isLoadingFriends: boolean = false;
  public _users = [];

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.backgroundColor = new Color('#222222');
    this.isLoadingFriends = true;
    this._userService.getFriendsList().subscribe(users =>{
      this.page.backgroundColor = new Color('#ffffff');
      this._users = users;
      this.isLoadingFriends = false;
    }, error => {
      alert('Unable to get your friend list');
      this.isLoadingFriends = false;
      this.goBack();
    });
    this.postToSend = this._postService.postToSend;
  }

  public makePost(){
    let selectedFriends = this.getSelectedFriends();
    if(selectedFriends.length === 0){
      alert('Select at least one friend');
      return;
    }
    this.postToSend.userList = selectedFriends;
    this._postService.processPost(this.postToSend).subscribe(respose => {
    }, error => {
      alert(error);
    });
    this._postService.postToSend =  new PostToSend({});
    this.routerExtensions.navigate(["/home"], { animated: false, clearHistory: true });
  }

  private getFriendIds(){
    let selectedFriends = this._users.filter(user => {
      return user.checked;
    });
    let ids = selectedFriends.map(user => {
      return user.id;
    });
    return ids;
  }

  private getSelectedFriends(){
    return this._users.filter(user => {
      return user.checked;
    });
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
