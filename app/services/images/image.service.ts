import {Injectable} from "@angular/core";
import {URLSearchParams, Response} from "@angular/http";
import {HttpInterceptorService} from "../http-interceptor/http-interceptor.service";
import {Observable} from "rxjs/Rx";
import {Image} from "../../models/image";
import {Session} from "../../models/session";
import {Post} from "../../models/post";
import {User} from "../../models/user";
import {PostToSend} from "../../models/post-to-send";
var config = require("../../shared/config");

@Injectable()
export class ImageService {
  private _temporaryImageAsset: any;
  private _imageUrl:string = ''; 
  constructor(
    private _httpInterceptorService: HttpInterceptorService
  ) {}

  public uploadImage(postData: PostToSend){
    let url = config.apiUrl + "/v1/posts";
    let payload:any = {
      post_type: postData.newPost.post_type,
      caption: postData.newPost.caption,
      post:{
        attachment:postData.newPost.image
      },
      location:[postData.newPost.location.longitude, postData.newPost.location.latitude],
      selected_users: this.getUserIdsFromUsers(postData.userList)
    };
    if(postData.newPost.post_type === 'reply'){
      payload.user_replying_to = postData.originPost.user.id;
      payload.post_replying_to = postData.originPost.id;
    }
    return this._httpInterceptorService.post(url, payload)
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  private getUserIdsFromUsers(users: Array<User>){
    if(!users || users.length === 0) {return [];}
    return users.map(user => {
      return user.id;
    });
  }

  public getAllImages(){
    let params: URLSearchParams = new URLSearchParams();
    let url:string = config.apiUrl + "/v1/feed";
    return this._httpInterceptorService.get(url, params)
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

  public getMemories(friendId:string){
    let params: URLSearchParams = new URLSearchParams();
    params.set('friend_id', friendId);
    let url:string = config.apiUrl + "/v1/get_memories";
    return this._httpInterceptorService.get(url, params)
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