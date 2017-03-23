interface UserJSON {
  avatar: string;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string;
  id: string;
  created_at: string;
}

export class User {
  private _avatar: string;
  private _email: string;
  private _first_name: string;
  private _last_name: string;
  private _user_name: string;
  private _id: string;
  private _created_at: string;

  constructor(object: any) {
    this._avatar = object && object.avatar || object && object._avatar || undefined;
    this._email = object && object.email || object && object._email || undefined;
    this._first_name = object && object.first_name || object && object._first_name || undefined;
    this._last_name = object && object.last_name || object && object._last_name || undefined;
    this._user_name = object && object.user_name || object && object._user_name || undefined;
    this._id = object && object.id || object && object._id || undefined;
    this._created_at = object && object.created_at || object && object._created_at || undefined;
  }

  public get avatar(): string {
    return this._avatar;
  }

  public set avatar(value: string) {
    this._avatar = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get first_name(): string {
    return this._first_name;
  }

  public set first_name(value: string) {
    this._first_name = value;
  }

  public get last_name(): string {
    return this._last_name;
  }

  public set last_name(value: string) {
    this._last_name = value;
  }

  public get user_name(): string {
    return this._user_name;
  }

  public set user_name(value: string) {
    this._user_name = value;
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
    return;
  }

  public set created_at(value: Date) {
    this._created_at = value.toString();
  }
} 