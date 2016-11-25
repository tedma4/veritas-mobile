import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {ImageService} from "../../services/images/image.service";
import {MapService} from "../../services/maps/map.service";
import {SessionService} from "../../services/sessions/session.service";
import * as camera from "nativescript-camera";
import imageSource = require("image-source");
import imageModule = require("ui/image");
import enumsModule = require('ui/enums');
import fsModule = require('file-system');
import {screen} from 'platform';

@Component({
  selector: "landing",
  providers: [ImageService, MapService],
  styleUrls: ['pages/landing/landing.component.css', 'app.css'],
  templateUrl: 'pages/landing/landing.component.html'
})
export class LandingComponent implements OnInit{
  private _location:any = {};
  constructor(
    private _imageService: ImageService,
    private _mapService: MapService,
    private routerExtensions: RouterExtensions,
    private _sessionService: SessionService
  ) {}

  ngOnInit() {
    camera.requestPermissions();
    this.getLocation(false);
  }

  public makePost() {
    this.getLocation(true);
    this.takePicture();
  }

  private getLocation(displayAlert: boolean){
    this._mapService.resolveLocation().subscribe(
    location => {
      this._location = location;
      console.log('latitude: ' + location.latitude + ' longitude: ' + location.longitude);
    },
    error => {
      if(displayAlert){
        alert('You must turn on your location');
      }
    });
  }

  private takePicture(){
   if(camera.isAvailable()){
      const scaleFactor = screen.mainScreen.scale;
      const width = 1080 / scaleFactor;
      const height = 1920 / scaleFactor;
      camera.takePicture({width: width, height: height, keepAspectRatio: true, saveToGallery: false}).then(imageAsset => {
        let source = new imageSource.ImageSource();
        source.fromAsset(imageAsset).then((source) => {
          let imageData = source.toBase64String('jpeg');
          this._imageService.uploadImage(imageData, this._location).subscribe(data => {
            console.log(data);
          });
        });
      });
    }else{
      alert('Camera is not available');
    }
  }

  public logOut(){
    this._sessionService.logOut();
    this.routerExtensions.navigate(["/welcome"], { animated: false });
  }

  public openSettings(){
    this.routerExtensions.navigate(["/settings"], { animated: false });
  }
}
