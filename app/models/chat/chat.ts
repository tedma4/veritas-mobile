import { User } from "../user";
import { Message } from "../chat/message";

export class Chat {
  private _id: string;
  private _chat_type: string;
  private _title: string;
  private _location: string;
  private _creator: string;
  private _messages: Array<Message>;

  constructor(object: any) {
    this._id = object && object.id || object && object._id || undefined;
    this._chat_type = object && object.chat_type || object && object._chat_type || undefined;
   this._title = object && object.title || object && object._title || undefined;
    this._location = object && object.location || object && object._locatio || undefined;
    this._creator = object && object.creator || object && object._creator || undefined;
    if (object.messages || object._messages) {
      this._messages = [];
      let messages: Array<any> = object.messages || object._messages;
      messages.forEach((message) => {
        this._messages.push(new Message(message));
      });
    }
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get chat_type(): string {
    return this._chat_type;
  }

  public set chat_type(value: string) {
    this._chat_type = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get location(): string {
    return this._location;
  }

  public set location(value: string) {
    this._location = value;
  }

  public get creator(): string {
    return this._creator;
  }

  public set creator(value: string) {
    this._creator = value;
  }

  public get messages(): Array<Message> {
    return this._messages;
  }

  public set messages(value: Array<Message>) {
    this._messages = value;
  }
}