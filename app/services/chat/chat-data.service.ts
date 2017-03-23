import {Injectable} from "@angular/core";
import {Chat} from "../../models/chat/chat";
import {Message} from "../../models/chat/message";
var appSettings = require("application-settings");

@Injectable()
export class ChatDataService {
  private allChatData:any;
  constructor(
  ) {}

  private getAllSavedChatData(){
    let allChatData = appSettings.getString("chatData");
    if(allChatData){
      return JSON.parse(allChatData);
    }
    return {};
  }

  public getChat(chatId:string){
    if(this.allChatData.hasOwnProperty(chatId)){
      return new Chat(this.allChatData[chatId]);
    }
    return new Chat({id: chatId, messages:[]});
  }

  public saveChat(chat: Chat){
    this.allChatData[chat.id] = chat;
    this.saveAllChatToStorage();
  }

  private saveAllChatToStorage(){
    appSettings.remove("chatData");
    appSettings.setString("chatData", JSON.stringify(this.allChatData));
  }

  public initChatService(){
    this.allChatData = this.getAllSavedChatData();
  }
}