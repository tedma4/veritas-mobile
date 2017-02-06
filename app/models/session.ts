import { User } from "../models/user";
interface SessionJSON{
	auth_token:string;
	user:User;
	created_at:string;
}

export class Session{
  private _auth_token:string;
	private _user:User;
	private _created_at:string;
	
	constructor(object:any){
	  this._auth_token = object && object.auth_token || object && object._auth_token || undefined;
		if(object.user){
			this._user = new User(object.user);	
		}else if(object._user){
			this._user = new User(object._user);
		}
	  this._created_at = object && object.created_at || object && object._created_at || undefined;
	}

	public get auth_token(): string {
		return this._auth_token;
	}

	public set auth_token(value: string) {
		this._auth_token = value;
	}

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;
	}

	public get created_at(): Date {
		if(this._created_at){
			return new Date(this._created_at);
		}
	}

	public set created_at(value: Date){
		this._created_at = value.toString();
	}
} 