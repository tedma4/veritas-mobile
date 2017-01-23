import {Injectable} from "@angular/core";
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {User} from "../../models/user";
import {SessionService} from "../../services/sessions/session.service";
var config = require("../../shared/config");

@Injectable()
export class UserService {
  constructor(
    private _http: Http,
    private _sessionService: SessionService
  ) {}

  getFriendsList() {
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(
      config.apiUrl + "/v1/friend_list?id=" + userId,
      {headers: headers}
    )
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

  searchUser(search){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let params: URLSearchParams = new URLSearchParams();
    params.set('search', search);
    params.set('user_id', userId);

    return this._http.get(
      config.apiUrl + "/v1/search",
      {headers: headers, search: params}
    )
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }


  sendFriendRequest(friendId: string){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + "/v1/send_request",
      JSON.stringify({
        user_id:userId,
        friend_id:friendId
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  updateUserData(userData: any){
    let userId = this._sessionService.getCurrentSession().user.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.patch(
      config.apiUrl + "/v1/users/" + userId,
      JSON.stringify(userData),
      { headers: headers }
    )
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