import {Injectable} from "@angular/core";
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import geolocation = require("nativescript-geolocation");
import application = require("application");
import {Observable} from "rxjs/Rx";
import {SessionService} from "../../services/sessions/session.service";
var config = require("../../shared/config");

@Injectable()
export class MapService {
  constructor(
    private _http: Http,
    private _sessionService: SessionService,
  ) {}

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

  private getDeviceLocation(){
    console.log('location is enabled, getting location');
    let locationConfiguration:any = {};
    if(application.android){
      locationConfiguration = {desiredAccuracy: 1, minimumUpdateTime:10000, maximumAge:10000, timeout:10000}
    }else{
      locationConfiguration = {desiredAccuracy: 1, minimumUpdateTime:10000, timeout:10000};
    }
    return Observable.create(locationObserver => {
      geolocation.getCurrentLocation(locationConfiguration)
      .then(location => {
        locationObserver.next(location);
        locationObserver.complete();
      }, (e) => {
        locationObserver.error(e); 
      });
    });
  }

  private turnOnLocation(){
    console.log('turning on location');
    return Observable.create(observer => {
      geolocation.enableLocationRequest().
      then(response => {
        console.log('the location was enabled');
        observer.next('The location was enabled');
        observer.complete(); 
      },(er) => {
        console.log('the location was not enabled');
        observer.error('The location was not enabled'); 
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

    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', userId);
    params.set('location', location.longitude + "," + location.latitude);
    params.set('time_stamp', new Date().toJSON());

    return this._http.get(config.apiUrl + "/v1/user_location",
    {headers: headers, search: params})
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