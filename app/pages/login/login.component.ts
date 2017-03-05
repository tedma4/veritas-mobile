import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {Session} from "../../models/session";
import {Page} from "ui/page";
var frameModule = require("ui/frame");

@Component({
  selector: "login",
  providers: [SessionService],
  styleUrls: ['pages/login/login.component.css', 'app.css'],
  templateUrl: 'pages/login/login.component.html'
})
export class LoginComponent implements OnInit{
  public isLoggingIn: boolean = false;

  constructor(
    private _sessionService: SessionService,
    private routerExtensions: RouterExtensions,
    private page:Page
  ) {}
  formModel:any = {};

  ngOnInit(){
    this.page.actionBarHidden = true;
  }

  public logIn() {
    this.isLoggingIn = true;
    this._sessionService.logIn(this.formModel.email, this.formModel.password)
    .subscribe(data => {
      this.isLoggingIn = false;
      let session = new Session(data);
      this.routerExtensions.navigate(["/home"], {animated: false, clearHistory: true});
    }, error => {
      this.isLoggingIn = false;
      alert('Incorrect email or password');
      this.formModel.email = '';
      this.formModel.password = '';
      console.log(error);
    });
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
