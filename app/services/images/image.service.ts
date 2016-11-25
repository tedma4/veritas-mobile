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
  private _imageUrl:string;
  constructor(private _http: Http, private _sessionService: SessionService) {}
  private _currentSession:Session;

  uploadImage(image:string, location: any){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http.post(
      config.apiUrl + "/v1/posts",
      JSON.stringify({
        user_id: this._currentSession.user.id,
        post_type: 'public',
        post:{
          attachment:image
        },
        location:[location.longitude, location.latitude],
        selected_users: ["3fk2GyeeosHZAD", "3fk2INsH2r695Z", "3fk2INsk56YFoL", "3fk2J2Kn1uSDuP", "3fk2Jjv2M4LonV"]
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      return data;
    })
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
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }

	public get imageUrl(): string {
		return this._imageUrl;
	}

	public set imageUrl(value: string) {
		this._imageUrl = value;
	}

}