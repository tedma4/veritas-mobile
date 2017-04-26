import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from "@angular/core";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { SessionService } from "../../services/sessions/session.service";
import { ChatDataService } from "../../services/chat/chat-data.service";
import { ChatCommunicationService } from "../../services/chat/chat-communication.service";
import scrollViewModule = require('ui/scroll-view');
import stackLayoutModule = require('ui/layouts/stack-layout');
import textViewModule = require('ui/text-view');
import { Color } from "color";
import { Page } from "ui/page";
import * as application from 'application';
import { Chat } from "../../models/chat/chat";
import { Message } from "../../models/chat/message";
var frame = require('ui/frame');

@Component({
  selector: "chat",
  styleUrls: ['pages/chat/chat.component.css', 'app.css'],
  templateUrl: 'pages/chat/chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  public formModel: any = {};
  public currentUserId: string;
  public keyboardGap: number = 0;
  private messageSubscription:any;
  private chatData: Chat = new Chat({ messages: [] });

  constructor(
    private routerExtensions: RouterExtensions,
    private page: Page,
    private pageRoute: PageRoute,
    private _sessionService: SessionService,
    private _chatDataService: ChatDataService,
    private _chatCommunicationService: ChatCommunicationService,
    private _ngZone: NgZone
  ) {
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => {
        this.chatData.id = params['chatId'];
        this.getChatData(params['chatId']);
        this.joinChat(params['chatId']);
      });
  }

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
    this.resizeChatOnKeyboradShow();
    this.initializeMessageSubscription();
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.scrollToBottom(100);
  }

  private joinChat(chatId:string){
    this.currentUserId = this._sessionService.getCurrentSession().user.id;
    this._chatCommunicationService.joinChat(chatId, this.currentUserId);
  }

  private initializeMessageSubscription(){
    this.messageSubscription = this._chatCommunicationService.getMessageSubject().subscribe({
      next: (message:any) => {
        if(message && message.chat_id === this.chatData.id){
          this._ngZone.run(() => {
            this.chatData.messages.push(new Message(message));
            this._chatDataService.saveChat(this.chatData);
            this.scrollToBottom(200);
          });
        }
      }
    });
  }

  private getChatData(chatId: string) {
    this.chatData = this._chatDataService.getChat(chatId);
  }

  public sendMessage(): void {
    if (!this.formModel.text) { return; }
    let message = {chat_id:this.chatData.id, user_id: this.currentUserId,
      content: this.formModel.text, message_type:'text', time_stamp: new Date()};
    this._chatCommunicationService.sendChatData(message);
    this.chatData.messages.push(new Message(message));
    this._chatDataService.saveChat(this.chatData);
    this.formModel.text = '';
    this.scrollToBottom(200);
  }

  private scrollToBottom(delay: number): void {
    setTimeout(() => {
      let scrollView = this.page.getViewById('scroll') as scrollViewModule.ScrollView;
      let chatContainer = this.page.getViewById('chatContainer') as stackLayoutModule.StackLayout;
      if(scrollView && chatContainer){
        let chatHeight: number = scrollView.scrollableHeight;
        scrollView.scrollToVerticalOffset(chatHeight, false);
      }
    }, delay);
  }

  private resizeChatOnKeyboradShow() {
    if (application.ios) {
      application.ios.addNotificationObserver(
        UIKeyboardWillChangeFrameNotification, (notification) => {
        let height: number = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey)
          .CGRectValue.size.height;
        this._ngZone.run(() => {
          this.keyboardGap = height;
          this.scrollToBottom(200);
        });
      });
    } else {
      let pageFrame = frame.topmost().currentPage.android;
      pageFrame.getViewTreeObserver().addOnGlobalLayoutListener(
        new android.view.ViewTreeObserver.OnGlobalLayoutListener({
        onGlobalLayout: () => {
          this._ngZone.run(() => {
            this.scrollToBottom(200);
          });
        }
      }));
    }
  }

  public goBack(): void {
    this.routerExtensions.backToPreviousPage();
  }
}
