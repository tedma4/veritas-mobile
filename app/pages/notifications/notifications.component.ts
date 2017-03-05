import {Component, OnInit, ViewChild} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { FloatingMenuComponent }  from '../../components/floating-menu/floating-menu.component';
import {NotificationsService} from "../../services/notifications/notifications.service";
import {PostService} from "../../services/post/post.service";
import {Notification} from "../../models/notification";
import {Post} from "../../models/post"
import {PostToSend} from "../../models/post-to-send"
import dialogs = require("ui/dialogs");
import {Page} from "ui/page";
import {Color} from "color";
import platformModule = require("platform");
var frameModule = require("ui/frame");
var config = require("../../shared/config");

@Component({
  selector: "notifications",
  providers: [NotificationsService],
  styleUrls: ['pages/notifications/notifications.component.css', 'app.css'],
  templateUrl: 'pages/notifications/notifications.component.html'
})
export class NotificationsComponent implements OnInit{
  public isDataLoading: boolean = true;
  public pageContent = 'collapsed';
  public screenWidth:number;
  public screenHeight:number;
  public _notifications: Array<Notification> = []; 
  public _apiUrl:string;

  private confirmOptions = {
    title: "Accept Friend Request",
    message: "Accept friend request?",
    okButtonText: "Yes",
    cancelButtonText: "No"
  };
  
  @ViewChild(FloatingMenuComponent)
  private floatingMenuComponent: FloatingMenuComponent;

  constructor(
    private _notificationsService: NotificationsService,
    private _postService: PostService,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
    this.screenHeight = platformModule.screen.mainScreen.heightDIPs;
    this._apiUrl = config.apiUrl;
    this._notificationsService.getUserNotifications().subscribe(notifications =>{
      this._notifications = notifications;
      this.pageContent = 'visible';
      this.isDataLoading = false;
    }, error => alert('Unable to get notifications'));
  }

  public selectNotification(notification: Notification){
    if(notification.notice_type === 'Sent Friend Request'){
      this.confirmOptions.message = "Accept friend request from " + notification.user.first_name + "?";
      dialogs.confirm(this.confirmOptions).then((result: boolean) => {
        if(result){
          this.processFriendRequest(notification, 'approve_friend_request');
        }else{
          this.processFriendRequest(notification, 'decline_friend_request');
        }
      });
    }
    if(notification.post){
      this.onPostSelect(notification.post);
    }
  }

  private onPostSelect(post:Post){
    let postToSend = new PostToSend({});
    let replyPost = new Post({});
    replyPost.post_type = 'reply';
    postToSend.originPost = post;
    postToSend.newPost = replyPost;
    this._postService.postToSend = postToSend;
    this.routerExtensions.navigate(["/post"], { animated: false });
  }

  private processFriendRequest(notification: Notification, userResponse: String){
    this._notificationsService.processFriendRequest(notification, userResponse).subscribe(response => {
      this.changeUserStatusInUI(notification, userResponse);
    }, error => { alert('Error when processing the request'); });
  }

  private changeUserStatusInUI(notification: Notification, userResponse: String){
    if(this._notifications && this._notifications.length > 0){
      let uiResponse =
      (userResponse === 'approve_friend_request') ? 'Friend Request Accepted': 'Friend Request Rejected';
      this._notifications.map(_notification =>{
        if(_notification.id === notification.id){ _notification.notice_type = uiResponse;}
      });
    }
  }

  public toogleMenu(event){
    this.floatingMenuComponent.toggleMenu(event);
  }

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
