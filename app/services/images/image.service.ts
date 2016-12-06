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

  uploadImage(caption:string, image:string, location: any, postType:string, friendIds){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let payload = {
      user_id: this._currentSession.user.id,
      post_type: postType,
      caption: caption,
      post:{
        attachment:image
      },
      location:[location.longitude, location.latitude],
      selected_users: friendIds
    };
    return this._http.post(
      config.apiUrl + "/v1/posts",
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