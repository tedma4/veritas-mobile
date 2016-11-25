import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {Session} from "../../models/session";
import {User} from "../../models/user";
import {UserService} from "../../services/users/user.service";
import {Page} from "ui/page";
import imageModule = require("ui/image");
import imageSource = require("image-source");
var cameraModule = require("camera");

@Component({
  selector: "settings",
  providers: [UserService],
  styleUrls: ['pages/settings/settings.component.css', 'app.css'],
  templateUrl: 'pages/settings/settings.component.html'
})
export class SettingsComponent implements OnInit{
  private formModel:any = {};
  private sessionData: Session;
  public avatar:any;

  constructor(
    private _sessionService: SessionService, 
    private _userService: UserService, 
    private page:Page,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(){
    this.sessionData = this._sessionService.getCurrentSession();
    this.prefillForm(this.sessionData); 
    this.avatar = this.page.getViewById('avatar') as imageModule.Image;
    if(this.sessionData.user.avatar){
      imageSource.fromUrl(this.sessionData.user.avatar)
      .then(res => {
        this.avatar.imageSource = res;
      }, error => {
        this.avatar.imageSource = imageSource.fromResource('avatardefault');
      });
    }else{
      this.avatar.imageSource = imageSource.fromResource('avatardefault');
    }
  }

  private prefillForm(sessionData:Session){
    this.formModel.first_name = sessionData.user.first_name;
    this.formModel.last_name = sessionData.user.last_name;
    this.formModel.user_name = sessionData.user.user_name;
    this.formModel.email = sessionData.user.email;
  }

  public saveChanges() {
    this._userService.updateUserData(this.formModel)
    .subscribe(data => {
      this._sessionService.saveUserData(data);
      this.sessionData = new Session(data);
      this.prefillForm(this.sessionData);
      this.goBack();
    }, error => {
      alert('Error when trying to update profile');
    });
  }
  
  public changeAvatar(){
    cameraModule.takePicture({width: 300, height: 300, keepAspectRatio: true}).then(picture => {
      this.avatar.imageSource = picture;
      this.formModel.avatar = picture.toBase64String('jpeg');
    }); 
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
