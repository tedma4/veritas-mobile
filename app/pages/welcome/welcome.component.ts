import {Component, OnInit} from "@angular/core";
import {Page} from "ui/page";
var config = require("../../shared/config");

@Component({
  selector: "welcome",
  styleUrls: ['pages/welcome/welcome.component.css', 'app.css'],
  templateUrl: 'pages/welcome/welcome.component.html'
})
export class WelcomeComponent implements OnInit{
  constructor(
    private page: Page
  ) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
  }
}
