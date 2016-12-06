import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {Page} from "ui/page";
import {Color} from "color";
import imageSource = require("image-source");
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');

@Component({
  selector: "post",
  styleUrls: ['pages/post/post.component.css', 'app.css'],
  templateUrl: 'pages/post/post.component.html'
})
export class PostComponent implements OnInit{
  public isImageLoading: boolean = true;
  public displayCaption: boolean = false;
  public _caption:string = '';
  private _imageUrl:string = '';
  private postImage:any;

  constructor(
    private routerExtensions: RouterExtensions,
    private pageRoute: PageRoute,
    private page: Page
  ) {
    this.pageRoute.activatedRoute
    .switchMap(activatedRoute => activatedRoute.params)
    .forEach((params) => {
      this._imageUrl = params['imageUrl'];
      this._caption = params['caption'] || '';
      this._imageUrl = this._imageUrl.replace(/slashy/g, "/");
      this._caption = this._caption.replace(/slashy/g, "/");
    });
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundColor = new Color('#222222');
    this.isImageLoading = true;
    
    imageSource.fromUrl(this._imageUrl)
    .then(res => {
      this.isImageLoading = false;
      setTimeout(() => {
        this.postImage = this.page.getViewById('postImage') as imageModule.Image;
        this.postImage.stretch = enumsModule.Stretch.aspectFill;
        this.postImage.imageSource = res;
        this.postImage.backgroundColor = new Color('white');
        if(this._caption.length > 0){
          this.displayCaption = true;
        }
      }, 500);
    }, error => {
      this.routerExtensions.backToPreviousPage();
      alert('This image could not be loaded');
    });
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
