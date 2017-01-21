import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";

@Component({
  selector: "landing",
  styleUrls: ['pages/landing/landing.component.css', 'app.css'],
  templateUrl: 'pages/landing/landing.component.html'
})
export class LandingComponent implements OnInit{
  constructor(
    private routerExtensions: RouterExtensions,
    private _sessionService: SessionService
  ) {}

  ngOnInit() {
  }

  public logOut(){
    this._sessionService.logOut();
    this.routerExtensions.navigate(["/welcome"], {animated: false, clearHistory: true});
  }

  public openSettings(){
    this.routerExtensions.navigate(["/settings"], {animated: false});
  }
}
