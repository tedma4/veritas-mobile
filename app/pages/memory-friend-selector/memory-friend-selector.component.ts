import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import {Post} from "../../models/post";
import {User} from "../../models/user";
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import listViewModule = require('ui/list-view');
import {Color} from "color";
import {Page} from "ui/page";
import platformModule = require("platform");
var config = require("../../shared/config");

@Component({
  selector: "memory-friend-selector",
  styleUrls: ['pages/memory-friend-selector/memory-friend-selector.component.css', 'app.css'],
  templateUrl: 'pages/memory-friend-selector/memory-friend-selector.component.html'
})
export class MemoryFriendSelectorComponent implements OnInit{
  public isDataLoading: boolean = true;
  public pageContent = 'collapsed';
  public screenWidth:number;
  public screenHeight:number;
  public _users = [];
  private uiList:any;

  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private _postService: PostService,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.screenHeight = platformModule.screen.mainScreen.heightDIPs;
    this.uiList = this.page.getViewById('list') as listViewModule.ListView;
    this.getUserList(true);
    this.verifyIfBackNavigation();
  }

  private verifyIfBackNavigation(){
    this.page.on('navigatedTo', (navigatedData) => {
      if(navigatedData.isBackNavigation){
        //this.getPostList(true);
      }
    });
  }

  private getUserList(displayLoadIndicator){
    if(displayLoadIndicator){
      this.isDataLoading = true;
      this.pageContent = 'collapsed';
    }
    this._postService.getMemoryFriendList().subscribe(users =>{
      this._users = users;
      this.uiList.refresh();
      this.isDataLoading = false;
      this.pageContent = 'visible';
    }, error => alert('Unable to get users'));
  }
  
  public onUserSelect(user:User){
    let userId:string = user.id;
    if(userId){
      this.routerExtensions.navigate(["memory-gallery/" + userId], { animated: false });
    }
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
