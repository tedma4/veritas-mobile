import {Component, OnInit, ViewChild, AfterViewInit} from "@angular/core";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {ChatDataService} from "../../services/chat/chat-data.service";
import {ChatCommunicationService} from "../../services/chat/chat-communication.service";
import scrollViewModule = require('ui/scroll-view');
import stackLayoutModule = require('ui/layouts/stack-layout');
import textViewModule = require('ui/text-view');
import {Color} from "color";
import {Page} from "ui/page";
import * as application from 'application';
import {Chat} from "../../models/chat/chat";
import {Message} from "../../models/chat/message";

@Component({
  selector: "chat",
  styleUrls: ['pages/chat/chat.component.css', 'app.css'],
  templateUrl: 'pages/chat/chat.component.html'
})
export class ChatComponent implements OnInit, AfterViewInit{
  public formModel:any = {};
  public currentUserId:string;
  private chatData: Chat = new Chat({messages:[]}); 

  constructor(
    private routerExtensions: RouterExtensions,
    private page: Page,
    private pageRoute: PageRoute,
    private _sessionService: SessionService,
    private _chatDataService: ChatDataService,
    private _chatCommunicationService: ChatCommunicationService
  ) {
    this.pageRoute.activatedRoute
    .switchMap(activatedRoute => activatedRoute.params)
    .forEach((params) => {
      this.getChatData(params['chatId']);
    });
  }

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.setResizeScrollIOS();
    this.currentUserId = this._sessionService.getCurrentSession().user.id;
  }

  ngAfterViewInit(){
    this.scrollToBottom(100);
  }

  private getChatData(chatId: string){
    this.chatData = this._chatDataService.getChat(chatId);
  }

  public sendMessage():void{
    if(!this.formModel.text){return;}
    this._chatCommunicationService.sendChatData(this.formModel.text);
    this.chatData.messages.push(
      new Message({user_id:this.currentUserId, text: this.formModel.text})
    );
    this._chatDataService.saveChat(this.chatData);
    this.formModel.text = '';
    this.scrollToBottom(200);
  }

  private scrollToBottom(delay: number):void{
    setTimeout(() =>{
      let scrollView = this.page.getViewById('scroll') as scrollViewModule.ScrollView;
      let chatContainer = this.page.getViewById('chatContainer') as stackLayoutModule.StackLayout;
      let chatHeight: number = scrollView.scrollableHeight;
      //console.log(chatHeight);
      scrollView.scrollToVerticalOffset(chatHeight, false);
    }, delay);
  }

  private setResizeScrollIOS(){
    /*if (application.ios) {
      application.ios.addNotificationObserver(UIKeyboardWillChangeFrameNotification, (notification) => {
        let height = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height;
        console.log(height);
      });
    }*/
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
