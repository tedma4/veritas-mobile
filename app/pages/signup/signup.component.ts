import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {Session} from "../../models/session";
import {User} from "../../models/user";
import {Page} from "ui/page";
var frameModule = require("ui/frame");

@Component({
  selector: "signup",
  styleUrls: ['pages/signup/signup.component.css', 'app.css'],
  templateUrl: 'pages/signup/signup.component.html'
})
export class SignupComponent implements OnInit{
  public isSigningUp: boolean = false;
  private currentPin:string;
  private formModel:any = {};

  constructor(
    private _sessionService: SessionService, 
    private routerExtensions: RouterExtensions,
    private page:Page
  ) {}

  ngOnInit(){
    this.currentPin = this._sessionService.currentPin;
    console.log(this.currentPin);
    this.formModel.pin = this.currentPin;
  }

  public signUp() {
    this.isSigningUp = true;
    this._sessionService.signUp(this.formModel)
    .then(data => {
      this.isSigningUp = false;
      let session = new Session(data);
      this.routerExtensions.navigate(["/landing"], { animated: false, clearHistory: true });
    })
    .catch(error => {
      this.isSigningUp = false;
      alert('There was an error signing up');
    });
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
