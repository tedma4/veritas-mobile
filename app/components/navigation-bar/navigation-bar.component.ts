import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import platformModule = require("platform");

@Component({
  selector: "navigation-bar",
  styleUrls: ['components/navigation-bar/navigation-bar.component.css'],
  templateUrl: 'components/navigation-bar/navigation-bar.component.html'
})
export class NavigationBarComponent implements OnInit{
  public screenWidth:number;
  public navBarSectionWidth:number;

  constructor(
  ) {}

  ngOnInit() {
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.navBarSectionWidth = this.screenWidth / 3;
  }
}
