import {Injectable} from "@angular/core";
import {Response, URLSearchParams} from "@angular/http";
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
import {Observable} from "rxjs/Rx";
import {User} from "../../models/user";
var config = require("../../shared/config");

@Injectable()
export class UserService {
  constructor(
    private _httpInterceptorService: HttpInterceptorService,
  ) {}

  public getFriendsList() {
    let params: URLSearchParams = new URLSearchParams();
    let url:string = config.apiUrl + "/v1/friend_list"; 
    return this._httpInterceptorService.get(url, params)
    .map(res => res.json())
    .map(data => {
      let usersList  = [];
      data.forEach((user) => {
        usersList.push(new User(user));
      });
      return usersList;
    })
    .catch(this.handleErrors);
  }

  public searchUser(search){
    let params: URLSearchParams = new URLSearchParams();
    params.set('search', search);
    let url:string = config.apiUrl + "/v1/search"; 
    return this._httpInterceptorService.get(url, params)
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }


  public sendFriendRequest(friendId: string){
    let url:string = config.apiUrl + "/v1/send_request";
    let body:any = {friend_id:friendId};
    return this._httpInterceptorService.post(url, body)
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  public updateUserData(userData: any){
    let url:string = config.apiUrl + "/v1/users/";
    return this._httpInterceptorService.patch(url, userData)
    .map(res => res.json())
    .map(data => {
      console.log(JSON.stringify(data));
      return data;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}