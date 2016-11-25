import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {SessionService} from "../../services/sessions/session.service";
import {Page} from "ui/page";
var frameModule = require("ui/frame");
import {Color} from "color";

var AbsoluteLayout = require("ui/layouts/absolute-layout").AbsoluteLayout;
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
import platformModule = require("platform");
import imageSource = require("image-source");
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import {ActionBar, NavigationButton} from "ui/action-bar";
var config = require("../../shared/config");

@Component({
  selector: "post",
  styleUrls: ['pages/post/post.component.css', 'app.css'],
  templateUrl: 'pages/post/post.component.html'
})
export class PostComponent implements OnInit{
  public isImageLoading: boolean = true;

  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private _sessionService: SessionService,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundColor = new Color('#222222');
    var absoluteLayout = new AbsoluteLayout();
    var stackLayout = new StackLayout();
    this.isImageLoading = true;
    
    imageSource.fromUrl(this._imageService.imageUrl)
    .then(res => {
      absoluteLayout.set('width', platformModule.screen.mainScreen.widthDIPs);
      var image = new imageModule.Image();
      var arrowImage = new imageModule.Image();
      image.imageSource = res;
      image.stretch = enumsModule.Stretch.aspectFill;
      image.backgroundColor = new Color('white');
      var arrowImageSource = imageSource.fromResource("backarrowshade");
      arrowImage.imageSource = arrowImageSource;
      arrowImage.set('width', 35);
      arrowImage.set('height', 35);
      arrowImage.set('marginLeft', 20);
      arrowImage.set('marginTop', 20);
      arrowImage.on('tap', e => {
        this.routerExtensions.backToPreviousPage();
      });
      stackLayout.set('left', 0);
      stackLayout.set('top', 0);
      stackLayout.set('width', platformModule.screen.mainScreen.widthDIPs);
      stackLayout.set('height', platformModule.screen.mainScreen.heightDIPs);
      stackLayout.addChild(image);
      absoluteLayout.addChild(stackLayout);
      absoluteLayout.addChild(arrowImage);
      this.isImageLoading = false;
      this.page.content = absoluteLayout;
    }, error => {
      this.routerExtensions.backToPreviousPage();
      alert('This image could not be loaded');
    });
  }
}
