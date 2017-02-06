import { Post } from "../models/post";
import { User } from "../models/user";

interface PostToSendJSON{
  originPost: Post,
  newPost: Post,
	userList: Array<User>
}

export class PostToSend{
  private _originPost: Post;
  private _newPost: Post;
	private _userList: Array<User>;

  constructor(object: any){
		if(object.originPost){
			this._originPost = new Post(object.originPost);	
		}else if(object._originPost){
			this._originPost = new Post(object._originPost);
		}
		if(object.newPost){
			this._newPost = new Post(object.newPost);	
		}else if(object._newPost){
			this._newPost = new Post(object._newPost);
		}
	  this._userList = object && object.userList || object && object._userList || undefined;
  }

	public get originPost(): Post {
		return this._originPost;
	}

	public set originPost(value: Post) {
		this._originPost = value;
	}

	public get newPost(): Post {
		return this._newPost;
	}

	public set newPost(value: Post) {
		this._newPost = value;
	}

	public get userList(): Array<User> {
		return this._userList;
	}

	public set userList(value: Array<User>) {
		this._userList = value;
	}
}