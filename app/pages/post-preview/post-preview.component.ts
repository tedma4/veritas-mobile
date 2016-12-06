import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import {SessionService} from "../../services/sessions/session.service";
import {Page} from "ui/page";
import {Color} from "color";
import platformModule = require("platform");
import imageSource = require("image-source");
import imageModule = require("ui/image");
import textViewModule = require("ui/text-view");
import enumsModule = require('ui/enums');

@Component({
  selector: "post-preview",
  providers: [PostService],
  styleUrls: ['pages/post-preview/post-preview.component.css', 'app.css'],
  templateUrl: 'pages/post-preview/post-preview.component.html'
})
export class PostPreviewComponent implements OnInit{
  private imageAsset:any = {};
  public screenWidth:number;
  public postBarSectionWidth:number;
  private previewImage:any;
  private caption:string = '';
  public displayCaption:boolean = false;
  
  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private _postService: PostService,
    private page: Page
  ) {}

  ngOnInit() {
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.postBarSectionWidth = this.screenWidth / 3;

    this.page.backgroundColor = new Color('#222222');
    this.previewImage = this.page.getViewById('previewImage') as imageModule.Image;
    this.previewImage.stretch = enumsModule.Stretch.aspectFill;
    this.imageAsset = this._imageService.temporaryImageAsset;

    let source = new imageSource.ImageSource();
    source.fromAsset(this.imageAsset).then((imageSource) => {
      this.previewImage.imageSource = imageSource;
    });
  }

  public setTextLimit(){
    this.displayCaption = !this.displayCaption;
    if(!this.displayCaption){return;}
    setTimeout(()=>{
      let captionInputView = this.page.getViewById("textCaption") as textViewModule.TextView;
      captionInputView.focus();
      captionInputView.on('propertyChange', (data) => {
        this.caption = captionInputView.text;
        if(captionInputView.text.length > 65) {
          setTimeout(() => {
            captionInputView.text = captionInputView.text.substr(0, 65);
            if(captionInputView.android){
              captionInputView.android.setSelection(65, 65);
            }
            /*if(captionInputView.ios){
              captionInputView.ios.selectedRange = NSMakeRange(3, 0);
            }*/
          },0);
        }
      });
    }, 500);
  }


  public makePublicPost(){
    this._postService.processPost(this.caption, [], 'public').subscribe(respose => {
    }, error => {
      alert(error);
    });
    this.routerExtensions.navigate(["/home"], { animated: false, clearHistory: true });
  }

  makeNonPublicPost(postType:string){
    this.routerExtensions.navigate(["/post-user-selection/" + postType + "/" + this.caption], {animated: false});
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
