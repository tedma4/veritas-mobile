import { Injectable } from "@angular/core";
var config = require("../../shared/config");
var ActionCable = require("nativescript-actioncable");
import { Chat } from "../../models/chat/chat";
import { Message } from "../../models/chat/message";

@Injectable()
export class ChatCommunicationService {
  private cable:any;
  private socketURL:any = config.wsApiUrl + "/cable";
  private room: any;

  constructor() {
    ActionCable.startDebugging();
    this.cable = ActionCable.createConsumer(this.socketURL);
  }

  public initChatCommunicationService() {
    this.room = this.cable.subscriptions.create('MessageChannel', {
      connected: this.onCableConnected,
      diconnected: this.onCableDisconnected,
      received: this.onDataReceived
    });
  }

  private onCableConnected(){
    console.log("connected to ChatChannel");
  }

  private onCableDisconnected(data:any){
    console.log('diconnected from ChatChannel');
    console.log(JSON.stringify(data));
  }

  private onDataReceived(data){
    console.log("received data " + JSON.stringify(data));
  }

  public sendChatData(data: any) {
    return this.room.perform('send_message', { message: data });
  }
}