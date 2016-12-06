import {Component, OnInit} from "@angular/core";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
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
  public isLoadingFriends: boolean = false;
  public _users = [];
  private _postType:string = '';
  private _caption:string = '';
  private _location:any = {};
  private imageAsset:any = {};

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private routerExtensions: RouterExtensions,
    private pageRoute: PageRoute,
    private page: Page
  ) {
    this.pageRoute.activatedRoute
    .switchMap(activatedRoute => activatedRoute.params)
    .forEach((params) => {
      this._postType = params['postType'];
      this._caption = params['caption'] || '';
    });
  }

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
  }

  public makePost(){
    let friendIds = this.getFriendIds();
    if(friendIds.length === 0){
      alert('Select at least one friend');
      return;
    }
    this._postService.processPost(this._caption, friendIds, this._postType).subscribe(respose => {
    }, error => {
      alert(error);
    });
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
