import {Component, OnInit} from "@angular/core";
import { RouterExtensions, PageRoute} from "nativescript-angular/router";
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
  selector: "memory-gallery",
  styleUrls: ['pages/memory-gallery/memory-gallery.component.css', 'app.css'],
  templateUrl: 'pages/memory-gallery/memory-gallery.component.html'
})
export class MemoryGalleryComponent implements OnInit{
  public isDataLoading: boolean = true;
  private friendId:string = '';
  public pageContent = 'collapsed';
  public screenWidth:number;
  public screenHeight:number;
  public thumbnailSize:number;
  public _memories = [];

  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private pageRoute: PageRoute,
    private _postService: PostService,
    private page: Page
  ) {
    this.pageRoute.activatedRoute
    .switchMap(activatedRoute => activatedRoute.params)
    .forEach((params) => {
      this.friendId = params['friendId'];
    });
  }

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.screenHeight = platformModule.screen.mainScreen.heightDIPs;
    this.thumbnailSize = Math.floor(this.screenWidth / 4);
    this.getMemories(true);
    this.verifyIfBackNavigation();
  }

  private verifyIfBackNavigation(){
    this.page.on('navigatedTo', (navigatedData) => {
      if(navigatedData.isBackNavigation){
        //this.getMemories(true);
      }
    });
  }

  private getMemories(displayLoadIndicator){
    if(displayLoadIndicator){
      this.isDataLoading = true;
      this.pageContent = 'collapsed';
    }
    this._imageService.getMemories(this.friendId).subscribe(memories =>{
      this._memories = memories;
      this.isDataLoading = false;
      this.pageContent = 'visible';
    }, error => alert('Unable to get memories'));
  }
  
  public onMemorySelect(memory:Post){
    let replyPostData = {
      postType:'reply',
      userId:memory.user.id,
      postId:memory.id,
      liked:memory.liked
    }
    this._postService.postDataToSend = replyPostData;
    let url:string = memory.image;
    let caption:string = memory.caption || '';
    url = url.replace(/\//g, "slashy");
    caption = caption.replace(/\//g, "slashy");
    if(url){
      this._imageService.imageUrl = url; 
      this.routerExtensions.navigate(["/post/" + url + "/" + caption], { animated: false });
    }
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
