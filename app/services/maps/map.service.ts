import {Injectable} from "@angular/core";
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import geolocation = require("nativescript-geolocation");
import application = require("application");
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs";
import {SessionService} from "../../services/sessions/session.service";
var config = require("../../shared/config");

@Injectable()
export class MapService {
  constructor(
    private _http: Http,
    private _sessionService: SessionService,
  ) {}
  private locationWatchId:any;

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
      if(isWatch){
        return {desiredAccuracy: 1, minimumUpdateTime:20000, maximumAge:10000};
      }
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

  private behaviorSubject = new BehaviorSubject(undefined);
  public getLocationWatch(){
    if(!this.locationWatchId){
      this.locationWatchId = geolocation.watchLocation(location => {
        if (location) {
          this.behaviorSubject.next(location);
        }
      }, e => {
        console.log("Error: " + e.message);
      }, this.getLocationConfiguration(true));
    }
    return this.behaviorSubject;
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
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', userId);
    params.set('location', longitude + "," + latitude);
    params.set('time_stamp', new Date().toJSON());

    return this._http.get(config.apiUrl + "/v1/map",
    {headers: headers, search: params})
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  public sendUserLocation(location){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let payload = {
      user_id: userId,
      location: location.longitude + "," + location.latitude,
      time_stamp: new Date(),
    };
    return this._http.post(config.apiUrl + "/v1/user_location",
    JSON.stringify(payload),
    {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}