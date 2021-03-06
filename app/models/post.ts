import { User } from "../models/user";
import { Location } from "../models/location";

interface PostJSON {
  id: string;
  created_at: string;
  image: string;
  location: Location;
  caption: string;
  post_type: string;
  user: User;
  liked: boolean;
}

export class Post {
  private _id: string;
  private _created_at: string;
  private _image: string;
  private _location: Location;
  private _caption: string;
  private _post_type: string;
  private _user: User;
  private _liked: boolean;

  constructor(object: any) {
    this._id = object && object.id || object && object._id || undefined;
    this._created_at = object && object.created_at || object && object._created_at || undefined;
    this._image = object && object.image || object && object._image || undefined;
    if (object.location) {
      this._location = new Location(object.location);
    } else if (object._location) {
      this._location = new Location(object._location);
    }
    this._caption = object && object.caption || object && object._caption || undefined;
    this._post_type = object && object.post_type || object && object._post_type || undefined;
    if (object.user) {
      this._user = new User(object.user);
    } else if (object._user) {
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
    if (this._created_at) {
      return new Date(this._created_at);
    }
  }

  public set created_at(value: Date) {
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

  public get post_type(): string {
    return this._post_type;
  }

  public set post_type(value: string) {
    this._post_type = value;
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