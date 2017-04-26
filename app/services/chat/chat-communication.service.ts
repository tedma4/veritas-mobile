import { Injectable } from "@angular/core";
var config = require("../../shared/config");
var SocketIO = require('nativescript-socket.io');
import { Chat } from "../../models/chat/chat";
import { Message } from "../../models/chat/message";
import {Subject} from "rxjs";

@Injectable()
export class ChatCommunicationService {
  private socket:any;
  private socketURL:any = config.wsApiUrl + '/chat';
  private room: any;

  constructor() {
    SocketIO.enableDebug();
  }
  private messageSubject = new Subject();

  public initChatCommunicationService() {
    this.socket = SocketIO.connect(this.socketURL);
    this.socket.on('connect', this.onSocketConnected);
    this.socket.on('disconnect', this.onSocketDisconnected);
    this.socket.on('message', (data) => {
      this.messageSubject.next(data);
    });
    this.socket.on('error', (error) => {
      console.log('error');
      console.log(error);
    });
  }

  private onSocketConnected(){
    console.log("connected to ChatChannel");
  }

  private onSocketDisconnected(){
    console.log('diconnected from ChatChannel');
  }

  public sendChatData(message) {
    this.socket.emit('message', {jwt:"token", message:message});
  }

  public joinChat(chatId:string, userId:string){
    this.socket.emit('joinChat', {jwt:"token", chatId:chatId, userId:userId});
  }

  public getMessageSubject(){
    return this.messageSubject;
  }
}