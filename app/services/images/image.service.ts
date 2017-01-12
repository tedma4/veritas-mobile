import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Image} from "../../models/image";
import {Session} from "../../models/session";
import {Post} from "../../models/post";
import {SessionService} from "../../services/sessions/session.service";
var config = require("../../shared/config");

@Injectable()
export class ImageService {
  private _temporaryImageAsset: any;
  private _imageUrl:string = ''; 
  constructor(private _http: Http, private _sessionService: SessionService) {}
  private _currentSession:Session;

  uploadImage(postData){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let url = config.apiUrl + "/v1/posts";
    if(postData.postType === 'reply'){
      url = url.concat('?user_replying_to=' + postData.userId + '&');
      url = url.concat('post_replying_to=' + postData.postId);
    }
    let payload = {
      user_id: this._currentSession.user.id,
      post_type: postData.postType,
      caption: postData.caption,
      post:{
        attachment:postData.imageData
      },
      location:[postData.location.longitude, postData.location.latitude],
      selected_users: postData.friendIds
    };
    return this._http.post(
      url,
      JSON.stringify(payload),
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  getAllImages(){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(config.apiUrl + "/v1/feed?id=" + this._currentSession.user.id, { headers: headers })
    .map(res => res.json())
    .map(data => {
      let postList = [];
      data.forEach((image) => {
        postList.push(new Post(image));
      });
      return postList;
    })
    .catch(this.handleErrors);
  }

  getMemories(friendId:string){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.get(config.apiUrl + "/v1/get_memories?user_id=" + this._currentSession.user.id + "&friend_id=" + friendId, { headers: headers })
    .map(res => res.json())
    .map(data => {
      let postList = [];
      data.forEach((image) => {
        postList.push(new Post(image));
      });
      return postList;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(error.url);
    console.log(error.status);
    console.log(error.statusText);
    return Observable.throw(error.json().error);
  }

  public get temporaryImageAsset(): any{
    return this._temporaryImageAsset;
  }

  public set temporaryImageAsset(value: any){
    this._temporaryImageAsset = value; 
  }

  public get imageUrl(): string{
    return this._imageUrl;
  }

  public set imageUrl(value: string){
    this._imageUrl = value; 
  }
}