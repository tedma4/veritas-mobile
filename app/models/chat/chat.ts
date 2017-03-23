import { User } from "../user";
import { Message } from "../chat/message";

export class Chat {
  private _id:string;
	private _users:Array<User>;
	private _chat_type:string;
	private _status:string;
	private _title:string;
	private _area:string;
  private _creator:string;
  private _messages:Array<Message>;

	constructor(object:any){
	  this._id = object && object.id || object && object._id || undefined;
	  this._users = object && object.users || object && object._users || undefined;
	  this._chat_type = object && object.chat_type || object && object._chat_type || undefined;
	  this._status = object && object.status || object && object._status || undefined;
	  this._title = object && object.title || object && object._title || undefined;
	  this._area = object && object.area || object && object._area || undefined;
	  this._creator = object && object.creator || object && object._creator || undefined;
		if(object.messages || object._messages){
			this._messages = [];
			let messages: Array<any> = object.messages || object._messages;
			messages.forEach((message) =>{
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

	public get users(): Array<User> {
		return this._users;
	}

	public set users(value: Array<User>) {
		this._users = value;
	}

	public get chat_type(): string {
		return this._chat_type;
	}

	public set chat_type(value: string) {
		this._chat_type = value;
	}

	public get status(): string {
		return this._status;
	}

	public set status(value: string) {
		this._status = value;
	}

	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

	public get area(): string {
		return this._area;
	}

	public set area(value: string) {
		this._area = value;
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