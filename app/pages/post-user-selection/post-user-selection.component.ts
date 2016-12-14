import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular/router";
import {UserService} from "../../services/users/user.service";
import {PostService} from "../../services/post/post.service";
import imageSource = require("image-source");
import {Page} from "ui/page";
import {Color} from "color";

@Component({
  selector: "post-user-selection",
  providers: [UserService, PostService],
  styleUrls: ['pages/post-user-selection/post-user-selection.component.css', 'app.css'],
  templateUrl: 'pages/post-user-selection/post-user-selection.component.html'
})

export class PostUserSelectionComponent implements OnInit{
  private postDataToSend:any;
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
    this.postDataToSend = this._postService.postDataToSend;
  }

  public makePost(){
    let friendIds = this.getFriendIds();
    if(friendIds.length === 0){
      alert('Select at least one friend');
      return;
    }
    this.postDataToSend.friendIds = friendIds;
    this._postService.processPost(this.postDataToSend).subscribe(respose => {
    }, error => {
      alert(error);
    });
    this._postService.postDataToSend = {};
    this.routerExtensions.navigate(["/home"], { animated: false, clearHistory: true });
  }

  private getFriendIds(){
    let selectedFriends = this._users.filter(user => {
      return user.checked;
    });
    let ids = selectedFriends.map(user => {
      console.log(user.id);
      return user.id;
    });
    return ids;
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
