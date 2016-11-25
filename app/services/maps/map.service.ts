import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import geolocation = require("nativescript-geolocation");
import {Observable} from "rxjs/Rx";
import {SessionService} from "../../services/sessions/session.service";
var config = require("../../shared/config");

@Injectable()
export class MapService {
  constructor(
    private _http: Http,
    private _sessionService: SessionService
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
    return Observable.create(locationObserver => {
      console.log('before location promise');
      geolocation.getCurrentLocation({desiredAccuracy: 3, minimumUpdateTime:10000, maximumAge:10000, timeout:10000})
      .then(location => {
        console.log(location);
        locationObserver.next(location);
        locationObserver.complete();
      }, (e) => {
        locationObserver.error(new Error('Unable to get location')); 
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
        observer.error(new Error('The location was not enabled')); 
      });
    });
  }

  public getUsersAround(latitude, longitude) {
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(config.apiUrl + "/v1/map?area=50,50&user_id=" + userId + "&current_location=" + latitude + "," + longitude,{ headers: headers })
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