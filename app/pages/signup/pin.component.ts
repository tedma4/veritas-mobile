import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {Session} from "../../models/session";
import {User} from "../../models/user";
import {Page} from "ui/page";
var frameModule = require("ui/frame");

@Component({
  selector: "pin",
  styleUrls: ['pages/signup/pin.component.css', 'app.css'],
  templateUrl: 'pages/signup/pin.component.html'
})
export class PinComponent implements OnInit{
  public isCheckingPIN: boolean = false;

  constructor(
    private _sessionService: SessionService, 
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}
  private formModel:any = {};

  ngOnInit(){
    this.isCheckingPIN = false;
    this.page.actionBarHidden = true;
  }

  public verifyPin() {
    this.isCheckingPIN = true;
    this._sessionService.verifyPin(this.formModel)
    .subscribe(data => {
      this._sessionService.currentPin = this.formModel.pin;
      this.routerExtensions.navigate(["/signup"], { animated: false });
    }, error => {
      this.isCheckingPIN = false;
      alert('Invalid PIN');
    });
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
