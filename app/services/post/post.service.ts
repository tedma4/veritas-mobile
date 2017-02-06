import {Injectable} from "@angular/core";
import {URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {ImageService} from "../../services/images/image.service";
import {MapService} from "../../services/maps/map.service"; 
import imageSourceModule = require("image-source");
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
import {User} from "../../models/user";
import {PostToSend} from "../../models/post-to-send";
import {Location} from "../../models/location";
var config = require("../../shared/config");

@Injectable()
export class PostService {
  private _imageUrl:string;
  private _postToSend:PostToSend;

  constructor(
    private _mapService: MapService,
    private _imageService: ImageService,
    private _httpInterceptorService: HttpInterceptorService
  ) {}

	public get postToSend(): PostToSend {
		return this._postToSend;
	}

	public set postToSend(value: PostToSend) {
		this._postToSend = value;
	}

  public likePost(postId:string){
    let body:any = {
      post_id: postId
    };
    let url = config.apiUrl + "/v1/like";
    return this._httpInterceptorService.post(url, body)
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  public getMemoryFriendList(){
    let params: URLSearchParams = new URLSearchParams();
    let url = config.apiUrl + "/v1/memories";
    return this._httpInterceptorService.get(url, params)
    .map(res => res.json())
    .map(data => {
      let userList = [];
      data.forEach((user) => {
        userList.push(new User(user));
      });
      return userList;
    })
    .catch(this.handleErrors);
  }

  public processPost(postData:PostToSend){
    return Observable.create(processPostObserver => {
      this.getImageStringFromAsset().subscribe({
        next: data => {
          postData.newPost.image = data;
          let location = new Location({}); 
          this._mapService.resolveLocation().subscribe(
          locationResponse => {
            location.latitude = locationResponse.latitude;
            location.longitude = locationResponse.longitude;
            postData.newPost.location = location;
            this.submitPost(postData).subscribe(
            data => {
              processPostObserver.next(data);
              processPostObserver.complete();
            }, error => {
              processPostObserver.error(error); 
            });
          },error => {
            alert('You must turn on your location');
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

  private submitPost(postData:PostToSend){
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