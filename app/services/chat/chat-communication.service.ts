import { Injectable } from "@angular/core";
var config = require("../../shared/config");
var ActionCable = require("nativescript-actioncable");
import { Chat } from "../../models/chat/chat";
import { Message } from "../../models/chat/message";

@Injectable()
export class ChatCommunicationService {
  private socketURL:any = config.wsApiUrl + "/v1/cable";
  private cable:any = ActionCable.createConsumer(this.socketURL);
  private room: any;

  constructor() {
    ActionCable.startDebugging();
  }

  public initChatCommunicationService() {
    this.room = this.cable.subscriptions.create("ChatChannel", {
      connected: this.onCableConnected,
      diconnected: this.onCableDisconnected,
      received: this.onDataReceived
    });
  }

  private onCableConnected(){
    console.log("connected to MessageChannel");
  }

  private onCableDisconnected(){
    console.log('diconnected from MessageChannel');
  }

  private onDataReceived(data){
    console.log("received data " + JSON.stringify(data));
  }

  public sendChatData(data: any) {
    return this.room.perform('send_message', { message: data });
  }
}