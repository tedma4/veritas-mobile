import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Session} from "../../models/session";
import {User} from  "../../models/user";
import {MapService} from "../../services/maps/map.service";
var appSettings = require("application-settings");
var config = require("../../shared/config");

@Injectable()
export class SessionService {
  private _currentSession:Session;
  private _currentPin:string;
  private _locationSubscription:any;

  constructor(
    private _http: Http,
    private _mapService: MapService
  ) {}

  public logIn(email:string, password:string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + "/v1/sessions",
      JSON.stringify({
        user:{
          email:email,
          password:password
        },
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      this.saveSession(data);
      this.startLocationWatch();
      return data;
    })
    .catch(this.handleErrors);
  }

  public signUp(form){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + "/v1/users",
      JSON.stringify({
        user:form
      }),
      { headers: headers }
    )
    .toPromise() 
    .then(res => {
      this.saveSession(res.json());
      return res.json();
    })
    .catch(this.handleError);
  }

  public verifyPin(form){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(config.apiUrl + "/v1/check_pin?pin=" +
      form.pin, { headers: headers })
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  private saveSession(sessionData){
    this._currentSession = new Session(sessionData);
    appSettings.remove("sessionData");
    appSettings.setString("sessionData", JSON.stringify(this._currentSession));
  }
  
  public saveUserData(userData:User){
    this._currentSession.user = userData;
    appSettings.remove("sessionData");
    appSettings.setString("sessionData", JSON.stringify(this._currentSession));
  }

	public getCurrentSession(): Session {
    if(!this._currentSession){
      var sessionData = appSettings.getString("sessionData");
      if(sessionData){
        this._currentSession = new Session(JSON.parse(sessionData));
        return this._currentSession;
      }
      else
        return;
    }else{
  		return this._currentSession;
    }
	}
  
  public logOut(){
    this._mapService.stopLocationWatch();
    this._currentSession = undefined;
    appSettings.remove("sessionData");
  }

  public turnOnLocation(){
    this._mapService.turnOnLocation().subscribe({
      next: data => {
        this.startLocationSubscription();
        if(this.getCurrentSession()){
          this.startLocationWatch();
        }
      },
      error: err => {
        console.log(err);
      }
    });
  } 

  public startLocationWatch(){
    if(this._currentSession){
      this._mapService.startLocationWatch();
    }
  }

  public startLocationSubscription(){
    this._locationSubscription = this._mapService.getLocationBehaviorSubject().subscribe({
      next: (location) => {
        if(location){
          this.sendUserLocation(location);
        }
      }
    });
  }

  private sendUserLocation(location){
    this._mapService.sendUserLocation(location,
      this._currentSession.user.id).subscribe(
      response => {},
      error => {console.log('Unable to send the location of user');}
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    console.log(error.message);
    return Promise.reject(error.message || error);
  }

  private handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

	public get currentPin(): string {
		return this._currentPin;
	}

	public set currentPin(value: string) {
		this._currentPin = value;
	}
  
}