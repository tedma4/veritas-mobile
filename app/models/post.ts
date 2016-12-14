import { User } from "../models/user";
import { Location }  from "../models/location";

interface PostJSON{
	id: string;
	created_at: string;
	image: string;
	location: Location;
	caption: string;
	hidden: boolean;
	user: User;
	liked: boolean;
}

export class Post{
  private _id: string;
	private _created_at: string;
	private _image: string;
	private _location: Location;
	private _caption:string;
	private _hidden: boolean;
	private _user: User;
	private _liked:boolean;

	constructor(object:any){
	  this._id = object && object.id || object && object._id || undefined;
	  this._created_at = object && object.created_at || object && object._created_at || undefined;
	  this._image = object && object.image || object && object._image || undefined;
		if(object.location){
			this._location = new Location(object.location);	
		}else{
			this._location = new Location(object._location);
		}
		this._caption = object && object.caption || object && object._caption || undefined;
	  this._hidden = object && object.hidden || object && object._hidden || undefined;
		if(object.user){
			this._user = new User(object.user);	
		}else{
			this._user = new User(object._user);
		}
	  this._liked = object && object.liked || object && object._liked || undefined;
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get created_at(): Date {
		if(this._created_at){
			return new Date(this._created_at);
		}
	}

	public set created_at(value: Date){
		this._created_at = value.toString();
	}

	public get image(): string {
		return this._image;
	}

	public set image(value: string) {
		this._image = value;
	}

	public get location(): Location {
		return this._location;
	}

	public set location(value: Location) {
		this._location = value;
	}

	public get caption(): string {
		return this._caption;
	}

	public set caption(value: string) {
		this._caption = value;
	}

	public get hidden(): boolean {
		return this._hidden;
	}

	public set hidden(value: boolean) {
		this._hidden = value;
	}

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;
	}

	public get liked(): boolean {
		return this._liked;
	}

	public set liked(value: boolean) {
		this._liked = value;
	}
} 