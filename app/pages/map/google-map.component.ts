import {Component, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { FloatingMenuComponent }  from '../../components/floating-menu/floating-menu.component';
import {MapService} from "../../services/maps/map.service";
import {ImageService} from "../../services/images/image.service";
import {PostService} from "../../services/post/post.service";
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
var mapsModule = require("nativescript-google-maps-sdk");
import {Color} from "color";
import {Post} from "../../models/post";
import {PostToSend} from "../../models/post-to-send";
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
  @ViewChild(FloatingMenuComponent)
  private floatingMenuComponent: FloatingMenuComponent;
  public enableFloatingMenu: string = 'collapsed';

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
    this.setMapRestrictions();
    this.initializeMapAndPosts();
  };

  private setMapRestrictions(){
    if(this.mapAPIObject.android){
      let androidUISetting = this.mapAPIObject.gMap.getUiSettings();
      androidUISetting.setScrollGesturesEnabled(false);
      androidUISetting.setZoomGesturesEnabled(false);
      this.mapAPIObject.gMap.setMyLocationEnabled(true);
    }else{
      this.mapAPIObject.gMap.settings.scrollGestures = false;
      this.mapAPIObject.gMap.settings.zoomGestures = false;
      this.mapAPIObject.gMap.settings.myLocationButton = true;
    }
  }

  private initializeMapAndPosts(){
    this.locationSubscription = this._mapService.getLocationBehaviorSubject().subscribe({
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
    this._mapService.getUsersAround(this.location.latitude,
    this.location.longitude).subscribe(loadedPosts => {
      this.mapAPIObject.removeAllMarkers();
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
  }

  private setMarkerOnMap(post: Post){
    let marker = new mapsModule.Marker();
    let mapPostIcon = new ImageModule.Image();
    mapPostIcon.imageSource = ImageSourceModule.fromResource(this.getPostIcon(post));
    marker.position = mapsModule.Position
      .positionFromLatLng(post.location.latitude, post.location.longitude);
    marker.title = post.user.first_name;
    marker.snippet = post.user.last_name;
    marker.userData = post;
    marker.icon = mapPostIcon;
    this.mapAPIObject.addMarker(marker);
  }

  private getPostIcon(post: Post):string{
    if(post.post_type === 'hidden'){
      let distance = this._mapService.getLocationDistance(post.location, this.location);
      return distance && distance < 20 ? 'visiblegray' : 'hiddengray';
    }
    return 'cameragray'; 
  }

  private setUserMarker(location):void{
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
    if(post.post_type === 'hidden'){
      let distance = this._mapService.getLocationDistance(post.location, this.location);
      if(distance && distance > 20) {return;};
    }
    let postToSend = new PostToSend({});
    let replyPost = new Post({});
    replyPost.post_type = 'reply';
    postToSend.originPost = post;
    postToSend.newPost = replyPost;
    this._postService.postToSend = postToSend;
    this.locationSubscription.unsubscribe();
    this.routerExtensions.navigate(["/post"], { animated: false });
  }

  public disableMenuContainer(event){
    this.enableFloatingMenu = 'collapsed';
  }

  public toogleMenu(event){
    if(this.enableFloatingMenu === 'collapsed'){
      this.enableFloatingMenu = 'visible';
    }
    this.floatingMenuComponent.toggleMenu(event);
  }
}