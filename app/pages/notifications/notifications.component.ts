import {Component, OnInit} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {NotificationsService} from "../../services/notifications/notifications.service";
import {Notification} from "../../models/notification";
import dialogs = require("ui/dialogs");
import {Page} from "ui/page";
var frameModule = require("ui/frame");
var config = require("../../shared/config");

@Component({
  selector: "notifications",
  providers: [NotificationsService],
  styleUrls: ['pages/notifications/notifications.component.css', 'app.css'],
  templateUrl: 'pages/notifications/notifications.component.html'
})
export class NotificationsComponent implements OnInit{
  public _notifications: Array<Notification> = []; 
  public _apiUrl:string;

  private confirmOptions = {
    title: "Accept Friend Request",
    message: "Accept friend request?",
    okButtonText: "Yes",
    cancelButtonText: "No"
  };
  
  constructor(
    private _notificationsService: NotificationsService,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}

  ngOnInit() {
    this._apiUrl = config.apiUrl;
    this._notificationsService.getUserNotifications().subscribe(notifications =>{
      this._notifications = notifications;
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

  public goBack(){
    this.routerExtensions.backToPreviousPage();
  }
}
