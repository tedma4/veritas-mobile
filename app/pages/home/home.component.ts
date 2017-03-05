import {Component, OnInit, ViewChild} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { FloatingMenuComponent }  from '../../components/floating-menu/floating-menu.component';
import {ImageService} from "../../services/images/image.service";
import {SessionService} from "../../services/sessions/session.service";
import {PostService} from "../../services/post/post.service";
import {Post} from "../../models/post";
import {PostToSend} from "../../models/post-to-send";
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import listViewModule = require('ui/list-view');
import {Color} from "color";
import {Page} from "ui/page";
import platformModule = require("platform");
var config = require("../../shared/config");

@Component({
  selector: "home",
  styleUrls: ['pages/home/home.component.css', 'app.css'],
  templateUrl: 'pages/home/home.component.html'
})
export class HomeComponent implements OnInit{
  public isDataLoading: boolean = true;
  public pageContent = 'collapsed';
  public screenWidth:number;
  public screenHeight:number;
  private _location:any = {};
  public _posts = [];
  private uiList:any;

  @ViewChild(FloatingMenuComponent)
  private floatingMenuComponent: FloatingMenuComponent;

  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private _sessionService: SessionService,
    private _postService: PostService,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.screenHeight = platformModule.screen.mainScreen.heightDIPs;
    this.uiList = this.page.getViewById('list') as listViewModule.ListView;
    this.getPostList(true);
    this.verifyIfBackNavigation();
  }

  private verifyIfBackNavigation(){
    this.page.on('navigatedTo', (navigatedData) => {
      if(navigatedData.isBackNavigation){
        //this.getPostList(true);
      }
    });
  }

  private getPostList(displayLoadIndicator){
    if(displayLoadIndicator){
      this.isDataLoading = true;
      this.pageContent = 'collapsed';
    }
    this._imageService.getAllImages().subscribe(posts =>{
      this._posts = posts.sort(this.sortByDate);
      this.uiList.refresh();
      this.isDataLoading = false;
      this.pageContent = 'visible';
    }, error => alert('Unable to get posts'));
  }
  
  private sortByDate(postA:Post, postB:Post){
    if(postA.created_at > postB.created_at){
      return -1;
    }
    if(postA.created_at < postB.created_at){
      return 1;
    }
    return 0;
  }

  public onPostSelect(post:Post){
    let postToSend = new PostToSend({});
    let replyPost = new Post({});
    replyPost.post_type = 'reply';
    postToSend.originPost = post;
    postToSend.newPost = replyPost;
    this._postService.postToSend = postToSend;
    this.routerExtensions.navigate(["/post"], { animated: false });
  }

  public toogleMenu(event){
    this.floatingMenuComponent.toggleMenu(event);
  }
}
