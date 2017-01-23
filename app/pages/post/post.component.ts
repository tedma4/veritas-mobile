import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {RouterExtensions} from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import {PostToSend} from "../../models/post-to-send";
import {Page} from "ui/page";
import {Color} from "color";
import platformModule = require("platform");
import imageSource = require("image-source");
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import * as camera from "nativescript-camera";
import {screen} from 'platform';

@Component({
  selector: "post",
  styleUrls: ['pages/post/post.component.css', 'app.css'],
  templateUrl: 'pages/post/post.component.html'
})
export class PostComponent implements OnInit{
  public isImageLoading: boolean = true;
  public displayCaption: boolean = false;
  public screenWidth:number;
  public screenHeight:number;
  private postImage:any;
  private absoluteContainer:any;
  private postToSend:PostToSend;

  constructor(
    private routerExtensions: RouterExtensions,
    private _imageService: ImageService,
    private _postService: PostService,
    private page: Page
  ) {}

  ngOnInit() {
    this.postToSend = this._postService.postToSend;
    camera.requestPermissions();
    this.page.actionBarHidden = true;
    this.page.backgroundColor = new Color('#333333');
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.screenHeight = platformModule.screen.mainScreen.heightDIPs;
    this.loadPicture();
  }

  private loadPicture(){
    this.isImageLoading = true;
    imageSource.fromUrl(this.postToSend.originPost.image)
    .then(res => {
      this.isImageLoading = false;
      this.postImage = this.page.getViewById('postImage') as imageModule.Image;
      this.postImage.stretch = enumsModule.Stretch.aspectFill;
      this.postImage.imageSource = res;
      this.postImage.backgroundColor = new Color('white');
      if(this.postToSend.originPost.caption.length > 0){
        this.displayCaption = true;
      }
      this.checkPostLiked();
    }, error => {
      this.routerExtensions.backToPreviousPage();
      alert('This image could not be loaded');
    });
  }

  private takePicture(){
    if(camera.isAvailable()){
      const scaleFactor = screen.mainScreen.scale;
      const width = 1080 / scaleFactor;
      const height = 1920 / scaleFactor;
      camera.takePicture({width: width, height: height, keepAspectRatio: true, saveToGallery: false}).then(imageAsset => {
        this._imageService.temporaryImageAsset = imageAsset;
        this.routerExtensions.navigate(["/post-preview"], { animated: false });
      });
    }else{
      alert('Camera is not available');
    }
  }

  private checkPostLiked(){
    if(this.postToSend.originPost.liked){
      let likeImage = this.page.getViewById('likeImage') as imageModule.Image;
      likeImage.imageSource = imageSource.fromResource("heart");
    }
  }

  public likePost(){
    if(this.postToSend.originPost.liked){return;}
    this._postService.likePost(this.postToSend.originPost.id).subscribe(data => {
    }, error => {
    });
    let likeImage = this.page.getViewById('likeImage') as imageModule.Image;
    likeImage.imageSource = imageSource.fromResource("heart");
    this.postToSend.originPost.liked = true;
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
