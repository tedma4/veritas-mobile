import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import platformModule = require("platform");
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import {MapService} from "../../services/maps/map.service";
import * as camera from "nativescript-camera";
import { RouterExtensions } from "nativescript-angular/router";
import {screen} from 'platform';

@Component({
  selector: "navigation-bar",
  providers: [MapService], 
  styleUrls: ['components/navigation-bar/navigation-bar.component.css'],
  templateUrl: 'components/navigation-bar/navigation-bar.component.html'
})
export class NavigationBarComponent implements OnInit{
  private _location:any = {};
  public screenWidth:number;
  public navBarSectionWidth:number;

  constructor(
    private _imageService: ImageService,
    private _postService: PostService,
    private routerExtensions: RouterExtensions,
    private _mapService: MapService,
  ) {}

  ngOnInit() {
    camera.requestPermissions();
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.navBarSectionWidth = this.screenWidth / 3;
  }

  private takePicture(){
   if(camera.isAvailable()){
      const scaleFactor = screen.mainScreen.scale;
      const width = 1080 / scaleFactor;
      const height = 1920 / scaleFactor;
      camera.takePicture({width: width, height: height, keepAspectRatio: true, saveToGallery: false}).then(imageAsset => {
        this._imageService.temporaryImageAsset = imageAsset;
        let replyPostData = {
          postType:'none',
        }
        this._postService.postDataToSend = replyPostData;
        this.routerExtensions.navigate(["/post-preview"], { animated: false });
      });
    }else{
      alert('Camera is not available');
    }
  }
}
