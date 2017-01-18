import { Component, OnInit} from "@angular/core";
import { Router} from "@angular/router";
import {MapService} from "./services/maps/map.service";
import platform = require("platform");
import {SessionService} from "./services/sessions/session.service";
import GMSServiceKey = require('./GMSServiceKey');

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {
  constructor(
    private _mapService: MapService, 
    private _sessionService: SessionService,
    private router: Router
  ){}

  private location:any = {};
  private locationInterval:any;
  ngOnInit() {
    if(platform.isIOS){
      GMSServiceKey();
    }
    this.turnOnLocation();
  }

  private turnOnLocation(){
    this._mapService.turnOnLocation().subscribe({
      next: data => {
        this.startLocationSubscription();
      },
      error: err => {
        console.log(err);
      }
    });
  } 

  private startLocationSubscription(){
    let userId = this._sessionService.getCurrentSession();
    if(!userId){ return; }
    let subscription = this._mapService.getLocationWatch().subscribe({
      next: (location) => {
        if(location){
          this.location = location;
          this.sendUserLocation();
        }
      }
    });
  }

  private sendUserLocation(){
    console.log('sending users location');
    this._mapService.sendUserLocation(this.location).subscribe(
      response => {},
      error => {console.log('Unable to send the location of user');}
    );
  }
}
