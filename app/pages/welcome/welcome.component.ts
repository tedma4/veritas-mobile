import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/sessions/session.service";
import {Page} from "ui/page";
var config = require("../../shared/config");

@Component({
  selector: "welcome",
  styleUrls: ['pages/welcome/welcome.component.css', 'app.css'],
  templateUrl: 'pages/welcome/welcome.component.html'
})
export class WelcomeComponent implements OnInit{

  constructor(
    private _sessionService: SessionService,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
  }
  
}
