import {Component, ElementRef, ViewChild} from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import {MapService} from "../../services/maps/map.service";
import {ImageService} from "../../services/images/image.service";
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
var mapsModule = require("nativescript-google-maps-sdk");
import {Color} from "color";

import {registerElement} from "nativescript-angular/element-registry";
import {topmost} from "ui/frame";
import {Page} from "ui/page";
declare var com: any;

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => mapsModule.MapView);

@Component({
  selector: 'google-map',
  styleUrls: ['pages/map/google-map.component.css', 'app.css'],
  providers: [MapService],
  templateUrl: 'pages/map/google-map.component.html'
})

export class GoogleMapComponent {
  constructor(
    private _mapService: MapService, 
    private _imageService: ImageService, 
    private routerExtensions: RouterExtensions,
    private page:Page
  ) { }
  @ViewChild("MapView") mapView: ElementRef;
  private location:any = {};
  private posts = [];
  private currentMapData:any = {};
  private mapAPIObject:any = {};
  
  //Map events
  onMapReady = (event) => {
    this.mapAPIObject = event.object;
    this._mapService.resolveLocation().subscribe(
    location => {
      this.location = location;
      console.log('latitude: ' + location.latitude + ' longitude: ' + location.longitude);
      this.setMapToCurrentLocationAndroid();
      this.requestPostsForMap(); 
    },
    error => {
      alert('You must turn on your location');
    });
  };

  private requestPostsForMap(){
    this._mapService.getUsersAround(this.location.latitude, this.location.longitude).subscribe(loadedPosts => {
      loadedPosts.forEach((post) => {
        this.setMarkerOnMap(post.caption, post.location.latitude, post.location.longitude, post.user.first_name, post.user.user_name, 'blue', post.image);
        this.posts.unshift(post);
        console.log(JSON.stringify(post));
      });
    }, error => alert('Unable to get friends'));
  }


  private setMapToCurrentLocationAndroid(){
    this.mapAPIObject.latitude = this.location.latitude;
    this.mapAPIObject.longitude = this.location.longitude;
    this.mapAPIObject.zoom = 5;
    this.setMarkerOnMap('', this.location.latitude, this.location.longitude, 'User', 'Current User', 'green', 'noUrl');
  }

  private setMarkerOnMap(caption, latitude, longitude, title, snippet, color, url){
    let marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(latitude, longitude);
    marker.title = title;
    marker.snippet = snippet;

    //marker.icon = new Color(color);
    marker.userData = {
      url : url,
      caption: caption
    };
    this.mapAPIObject.addMarker(marker);
  }

  onMarkerSelect = (event) => {
    let url:string = event.marker.userData.url;
    let caption:string = event.marker.userData.caption || '';
    url = url.replace(/\//g, "slashy");
    caption = caption.replace(/\//g, "slashy");
    if(url != 'noUrl'){
      this.routerExtensions.navigate(["/post/" + url + "/" + caption], { animated: false });
    }
  }
}