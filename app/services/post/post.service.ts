import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {ImageService} from "../../services/images/image.service";
import {MapService} from "../../services/maps/map.service"; 
import imageSource = require("image-source");

@Injectable()
export class PostService {
  private _imageUrl:string;
  private _temporaryImageAsset: any;

  constructor(
    private _mapService: MapService,
    private _imageService: ImageService
  ) {}

  public processPost(caption:string, friendIds, postType:string){
    return Observable.create(processPostObserver => {
      this.getImageStringFromAsset().subscribe({
        next: data => {
          let imageData = data;
          let location:any = {};
          this._mapService.resolveLocation().subscribe(
          locationResponse => {
            location = locationResponse;
            console.log('latitude: ' + location.latitude + ' longitude: ' + location.longitude);
            this.submitPost(caption, imageData, location, postType, friendIds).subscribe(
            data => {
              processPostObserver.next(data);
              processPostObserver.complete();
            }, error => {
              processPostObserver.error(error); 
            });
          },error => {
            alert('You must turn on your location');
            this.submitPost(caption, imageData, location, postType, friendIds).subscribe(
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
    let source = new imageSource.ImageSource();
    return Observable.create(imageObserver => {
      source.fromAsset(imageAsset).then((imageSource) => {
        let imageData = imageSource.toBase64String('jpeg');
        imageObserver.next(imageData);
        imageObserver.complete();
      });
    });
  } 

  private submitPost(caption, imageData, location, postType, friendIds){
    return Observable.create(postObserver => {
      this._imageService.uploadImage(caption, imageData, location, postType, friendIds).subscribe(data => {
        postObserver.next(data);
        postObserver.complete();
      }, error => {
        postObserver.error('Error when submitting post'); 
      }); 
    });
  }
}