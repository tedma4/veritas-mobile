import {Component, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import {MapService} from "../../services/maps/map.service";
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
var mapsModule = require("nativescript-google-maps-sdk");
import {Color} from "color";
import {Post} from "../../models/post";

import {registerElement} from "nativescript-angular/element-registry";
import ImageModule = require("ui/image");
import ImageSourceModule = require("image-source");
import {topmost} from "ui/frame";
import {Page} from "ui/page";
declare var com: any;

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => mapsModule.MapView);

@Component({
  selector: 'google-map',
  styleUrls: ['pages/map/google-map.component.css', 'app.css'],
  templateUrl: 'pages/map/google-map.component.html'
})

export class GoogleMapComponent implements OnDestroy {
  constructor(
    private _mapService: MapService, 
    private _imageService: ImageService, 
    private _postService: PostService,
    private routerExtensions: RouterExtensions,
    private page:Page
  ) { }
  @ViewChild("MapView") mapView: ElementRef;
  private location:any = {};
  private posts = [];
  private currentMapData:any = {};
  private mapAPIObject:any = {};
  private locationSubscription:any;
  
  //Map events
  onMapReady = (event) => {
    this.mapAPIObject = event.object;
    this.initializeMapAndPosts();
  };

  private initializeMapAndPosts(){
    this.locationSubscription = this._mapService.getLocationWatch().subscribe({
      next: (location) => {
        if(location){
          console.log('initializing map');
          this.location = location;
          this.setMapToCurrentLocation();
          this.requestPostsForMap(); 
        }
      }
    });
  }

  ngOnDestroy() {
    this.locationSubscription.unsubscribe();
  }

  private requestPostsForMap(){
    this._mapService.getUsersAround(this.location.latitude, this.location.longitude).subscribe(loadedPosts => {
      this.mapAPIObject.removeAllMarkers();
      this.setUserMarker(this.location);
      loadedPosts.forEach((post) => {
        this.setMarkerOnMap(post);
        this.posts.unshift(post);
      });
    }, error => alert('Unable to get posts on the map'));
  }


  private setMapToCurrentLocation(){
    this.mapAPIObject.latitude = this.location.latitude;
    this.mapAPIObject.longitude = this.location.longitude;
    this.mapAPIObject.zoom = 14;
    this.setUserMarker(this.location);
  }

  private setMarkerOnMap(post: Post){
    let marker = new mapsModule.Marker();
    let mapPostIcon = new ImageModule.Image();
    mapPostIcon.imageSource = ImageSourceModule.fromResource("cameragray");
    marker.position = mapsModule.Position
      .positionFromLatLng(post.location.latitude, post.location.longitude);
    marker.title = post.user.first_name;
    marker.snippet = post.user.last_name;
    marker.userData = post;
    marker.icon = mapPostIcon;
    this.mapAPIObject.addMarker(marker);
  }

  private setUserMarker(location){
    let marker = new mapsModule.Marker();
    let mapUserIcon = new ImageModule.Image();
    mapUserIcon.imageSource = ImageSourceModule.fromResource("target");
    marker.position = mapsModule.Position
      .positionFromLatLng(location.latitude, location.longitude);
    marker.title = 'Current';
    marker.snippet = 'User';
    marker.userData = undefined;
    marker.icon = mapUserIcon;
    this.mapAPIObject.addMarker(marker);
  }

  onMarkerSelect = (event) => {
    if(!event.marker.userData){return;}
    let post:Post = event.marker.userData;
    let replyPostData = {
      postType:'reply',
      userId:post.user.id,
      postId:post.id,
      liked:post.liked
    }
    this._postService.postDataToSend = replyPostData;
    let url:string = post.image;
    let caption:string = post.caption || '';
    url = url.replace(/\//g, "slashy");
    caption = caption.replace(/\//g, "slashy");
    if(url){
      this._imageService.imageUrl = url;
      this.locationSubscription.unsubscribe();
      this.routerExtensions.navigate(["/post/" + url + "/" + caption], { animated: false });
    }
  }
}