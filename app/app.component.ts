import { Component, OnInit} from "@angular/core";
import { Router} from "@angular/router";
import {MapService} from "./services/maps/map.service";
import platform = require("platform");
import GMSServiceKey = require('./GMSServiceKey');

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {
  constructor(
    private _mapService: MapService, 
    private router: Router
  ){}

  private location:any = {};
  private locationInterval:any;
  ngOnInit() {
    if(platform.isIOS){
      GMSServiceKey();
    }
    this.getLocation();
    this.locationInterval =
      setInterval(() => this.getLocation(), 30000);
  }

  private getLocation(){
    this._mapService.resolveLocation().subscribe(
    location => {
      this.location = location;
      this.sendUserLocation();
    },
    error => {
      console.log(error);
    });
  }

  private sendUserLocation(){
    this._mapService.sendUserLocation(this.location).subscribe(
      response => {},
      error => {console.log('Unable to send the location of user');}
    );
  }
}
