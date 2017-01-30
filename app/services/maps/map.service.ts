import {Injectable} from "@angular/core";
import {URLSearchParams, Response} from "@angular/http";
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
import geolocation = require("nativescript-geolocation");
import application = require("application");
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs";
var config = require("../../shared/config");

@Injectable()
export class MapService {
  constructor(
    private _httpInterceptorService: HttpInterceptorService
  ) {}
  private locationWatchId:any;
  private behaviorSubject = new BehaviorSubject(undefined);

  public resolveLocation(){
    return Observable.create(resolveObserver => {
      if (!geolocation.isEnabled()) {
        this.turnOnLocation().subscribe({
          next: data => {
            this.getDeviceLocation().subscribe({
              next: location => {
                resolveObserver.next(location);
                resolveObserver.complete();
              },
              error: err => { resolveObserver.error(err); }
            });
          },
          error: err => { resolveObserver.error(err); }
        });
      }else{
        this.getDeviceLocation().subscribe({
          next: location => {
            resolveObserver.next(location);
            resolveObserver.complete();
          },
          error: err => { resolveObserver.error(err); }
        });
      }
    });
  }

  private getLocationConfiguration(isWatch):any{
    if(application.android){
      if(isWatch)
        return {desiredAccuracy: 1, minimumUpdateTime:20000, maximumAge:10000};
      else
        return {desiredAccuracy: 1, minimumUpdateTime:10000, maximumAge:10000, timeout:10000};
    }else{
      if(isWatch)
        return {desiredAccuracy: 1, minimumUpdateTime:20000, maximumAge:10000};
      else
        return {desiredAccuracy: 1, minimumUpdateTime:10000, timeout:10000};
    }
  }

  private getDeviceLocation(){
    return Observable.create(locationObserver => {
      geolocation.getCurrentLocation(this.getLocationConfiguration(false))
      .then(location => {
        locationObserver.next(location);
        locationObserver.complete();
      }, (e) => {
        locationObserver.error(e); 
      });
    });
  }

  public startLocationWatch(){
    if(!this.locationWatchId){
      this.locationWatchId = geolocation.watchLocation(location => {
        if (location) {
          this.behaviorSubject.next(location);
        }
      }, e => {
        console.log("Error: " + e.message);
      }, this.getLocationConfiguration(true));
    }
  }

  public getLocationBehaviorSubject(){
    return this.behaviorSubject;
  }

  public stopLocationWatch(){
    geolocation.clearWatch(this.locationWatchId);
    this.locationWatchId = undefined;
    this.behaviorSubject.next(undefined);
  }

  public turnOnLocation(){
    console.log('turning on location');
    return Observable.create(observer => {
      geolocation.enableLocationRequest().
      then(response => {
        console.log('the location was enabled');
        observer.next('The location was enabled');
        observer.complete(); 
      },(er) => {
        observer.error(er); 
      });
    });
  }

  public getUsersAround(latitude, longitude) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('location', longitude + "," + latitude);
    params.set('time_stamp', new Date().toJSON());
    let url:string = config.apiUrl + "/v1/map";
    return this._httpInterceptorService.get(url, params)
    .map(res => res.json()).map(data => {return data;})
    .catch(this.handleErrors);
  }

  public sendUserLocation(location){
    let body:any = {
      location: location.longitude + "," + location.latitude,
      time_stamp: new Date().toJSON(),
    };
    let url:string = config.apiUrl + "/v1/user_location";
    return this._httpInterceptorService.post(url, body)
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  public getLocationDistance(location1:any, location2:any){
    return geolocation.distance(location1, location2); 
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}