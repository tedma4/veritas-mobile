import {Injectable} from "@angular/core";
import {URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Session} from "../../models/session";
import {User} from  "../../models/user";
import {MapService} from "../../services/maps/map.service";
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
var appSettings = require("application-settings");
var config = require("../../shared/config");

@Injectable()
export class SessionService {
  private _currentSession:Session;
  private _currentPin:string;
  private _locationSubscription:any;

  constructor(
    private _httpInterceptorService: HttpInterceptorService,
    private _mapService: MapService
  ) {}

  public logIn(email:string, password:string) {
    let url: string = config.apiUrl + "/v1/sessions";
    let body:any = {user:{
      email:email,
      password:password
    }};
    return this._httpInterceptorService.post(url, body)
    .map(res => res.json())
    .map(data => {
      this.saveSession(data);
      this.startLocationWatch();
      this._httpInterceptorService.jwt =
        this._currentSession.auth_token;
      return data;
    })
    .catch(this.handleErrors);
  }

  public signUp(form){
    let url:string = config.apiUrl + "/v1/users";
    let body:any = {user:form};
    return this._httpInterceptorService.post(url, body)
    .toPromise() 
    .then(res => {
      this.saveSession(res.json());
      return res.json();
    })
    .catch(this.handleError);
  }

  public verifyPin(form){
    let url:string = config.apiUrl + "/v1/check_pin";
    let params: URLSearchParams = new URLSearchParams();
    params.set('pin', form.pin);
    return this._httpInterceptorService.get(url, params)
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
    let params: URLSearchParams = new URLSearchParams();
    let url:string = config.apiUrl + "/v1/sessions";
    this._httpInterceptorService.delete(url, params);
    this._mapService.stopLocationWatch();
    this._currentSession = undefined;
    this._httpInterceptorService.jwt = undefined;
    appSettings.remove("sessionData");
    appSettings.remove("chatData");
  }

  public turnOnLocation(){
    this._mapService.turnOnLocation().subscribe({
      next: data => {
        this.startLocationSubscription();
        if(this.getCurrentSession()){
          this._httpInterceptorService.jwt =
            this._currentSession.auth_token;
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
    this._mapService.sendUserLocation(location).subscribe(
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