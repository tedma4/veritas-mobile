import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {SessionService} from "../../services/sessions/session.service";
import {Notification} from "../../models/notification";
var config = require("../../shared/config");

@Injectable()
export class NotificationsService {
  constructor(
    private _http: Http,
    private _sessionService: SessionService
  ) {}

  public getUserNotifications() {
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(config.apiUrl + "/v1/notifications?user_id=" + userId, { headers: headers })
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  processFriendRequest(notification: Notification, type){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + "/v1/" + type,
      JSON.stringify({
        user_id: userId,
        friend_id: notification.user.id,
        notification_id: notification.id
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  unfriendUser(friendId: String){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + '/v1/remove_friend',
      JSON.stringify({
        user_id: userId,
        friend_id: friendId
      }),
      { headers: headers }
    )
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