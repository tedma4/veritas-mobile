import { User } from "../models/user";
import { Post } from "../models/post";

interface NotificationJSON{
	id: string;
	created_at: string;
	notice_type: string;
	user: User;
	post: Post;
}

export class Notification{
  private _id: string;
	private _created_at: string;
	private _notice_type: string;
	private _user: User;
	private _post:Post;

	constructor(object:any){
	  this._id = object && object.id || object && object._id || undefined;
	  this._created_at = object && object.created_at || object && object._created_at || undefined;
	  this._notice_type = object && object.notice_type || object && object._notice_type || undefined;
		if(object.user){
			this._user = new User(object.user);	
		}else if(object._user){
			this._user = new User(object._user);
		}
		if(object.post){
			this._post = new Post(object.post);	
		}else if(object._post){
			this._post = new Post(object._post);
		}
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get created_at(): string {
		return this._created_at;
	}

	public set created_at(value: string) {
		this._created_at = value;
	}

	public get notice_type(): string {
		return this._notice_type;
	}

	public set notice_type(value: string) {
		this._notice_type = value;
	}

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;
	}

	public get post(): Post {
		return this._post;
	}

	public set post(value: Post) {
		this._post = value;
	}
} 