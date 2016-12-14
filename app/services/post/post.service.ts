import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {ImageService} from "../../services/images/image.service";
import {MapService} from "../../services/maps/map.service"; 
import imageSourceModule = require("image-source");
import {SessionService} from "../../services/sessions/session.service";
import {Session} from "../../models/session";
var config = require("../../shared/config");

@Injectable()
export class PostService {
  private _imageUrl:string;
  private _postDataToSend:any;
  private _currentSession:Session;

  constructor(
    private _mapService: MapService,
    private _imageService: ImageService,
    private _http: Http,
    private _sessionService: SessionService
  ) {}

	public get postDataToSend(): any {
		return this._postDataToSend;
	}

	public set postDataToSend(value: any) {
		this._postDataToSend = value;
	}

  public likePost(postId){
    this._currentSession = this._sessionService.getCurrentSession();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let url = config.apiUrl + "/v1/like";
    url = url.concat('?user_id=' + this._currentSession.user.id + '&');
    url = url.concat('post_id=' + postId);
    return this._http.post(
      url, {}, { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  public processPost(postData){
    return Observable.create(processPostObserver => {
      this.getImageStringFromAsset().subscribe({
        next: data => {
          postData.imageData = data;
          postData.location = {};
          this._mapService.resolveLocation().subscribe(
          locationResponse => {
            postData.location = locationResponse;
            console.log('latitude: ' + postData.location.latitude + ' longitude: ' + postData.location.longitude);
            this.submitPost(postData).subscribe(
            data => {
              processPostObserver.next(data);
              processPostObserver.complete();
            }, error => {
              processPostObserver.error(error); 
            });
          },error => {
            alert('You must turn on your location');
            this.submitPost(postData).subscribe(
            data => {
              processPostObserver.next(data);
              processPostObserver.complete();
            }, error => {
              processPostObserver.error(error); 
            });
          });
        }
      });
    });
  }

  private getImageStringFromAsset(){
    let imageAsset = this._imageService.temporaryImageAsset;
    let source = new imageSourceModule.ImageSource();
    return Observable.create(imageObserver => {
      source.fromAsset(imageAsset).then((imageSource) => {
        console.log(imageSource.rotationAngle);
        let imageData = imageSource.toBase64String('jpeg');
        imageObserver.next(imageData);
        imageObserver.complete();
      });
    });
  } 

  private submitPost(postData){
    return Observable.create(postObserver => {
      this._imageService.uploadImage(postData).subscribe(data => {
        postObserver.next(data);
        postObserver.complete();
      }, error => {
        postObserver.error('Error when submitting post'); 
      }); 
    });
  }

  handleErrors(error: Response) {
    console.log(error.url);
    console.log(error.status);
    console.log(error.statusText);
    return Observable.throw(error.json().error);
  }
}