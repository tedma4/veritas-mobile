import {Injectable} from "@angular/core";
import {Chat} from "../../models/chat/chat";
import {Message} from "../../models/chat/message";
var appSettings = require("application-settings");

@Injectable()
export class ChatDataService {
  constructor(
  ) {}

  public getChat(chatId:string){
    let chatData = appSettings.getString("chat-" + chatId);
    if(chatData){
      return new Chat(JSON.parse(chatData));
    }
    return new Chat({id: chatId, messages:[]});
  }

  public saveChat(chat: Chat){
    appSettings.setString("chat-" + chat.id, JSON.stringify(chat));
  }
}