import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {URLSearchParams, Response} from "@angular/http";
import {Notification} from "../../models/notification";
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
var config = require("../../shared/config");

@Injectable()
export class NotificationsService {
  constructor(
    private _httpInterceptorService: HttpInterceptorService
  ) {}

  public getUserNotifications() {
    let params: URLSearchParams = new URLSearchParams();
    let url:string = config.apiUrl + "/v1/notifications";
    return this._httpInterceptorService.get(url, params)
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  public processFriendRequest(notification: Notification, type){
    let url:string = config.apiUrl + "/v1/" + type;
    let body:any = {
      friend_id: notification.user.id,
      notification_id: notification.id
    }
    return this._httpInterceptorService.post(url, body)
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  public unfriendUser(friendId: String){
    let url:string = config.apiUrl + '/v1/remove_friend';
    let body:any = {friend_id: friendId};
    return this._httpInterceptorService.post(url, body)
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