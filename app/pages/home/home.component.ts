import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {SessionService} from "../../services/sessions/session.service";
import {Post} from "../../models/post";
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import {Page} from "ui/page";
var config = require("../../shared/config");

@Component({
  selector: "home",
  styleUrls: ['pages/home/home.component.css', 'app.css'],
  templateUrl: 'pages/home/home.component.html'
})
export class HomeComponent implements OnInit{
  private _location:any = {};
  public _posts = [];
  public _apiUrl:string;

  constructor(
    private _imageService: ImageService,
    private routerExtensions: RouterExtensions,
    private _sessionService: SessionService,
    private page: Page
  ) {}

  ngOnInit() {
    this._apiUrl = config.apiUrl;
    this._imageService.getAllImages().subscribe(posts =>{
      this._posts = posts;
    }, error => alert('Unable to get posts'));
  }
  
  public onPostSelect(post:Post){
    let url:string = post.image;
    if(url){
      this._imageService.imageUrl = url;
      this.routerExtensions.navigate(["/post"], { animated: false });
    }
  }
}
