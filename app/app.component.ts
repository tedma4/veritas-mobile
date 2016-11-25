import { Component, OnInit} from "@angular/core";
import { Router} from "@angular/router";
import platform = require("platform");
import GMSServiceKey = require('./GMSServiceKey');

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    if(platform.isIOS){
      GMSServiceKey();
    }
  }
}
