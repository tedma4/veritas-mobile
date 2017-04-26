export class Message {
  private _user_id: string;
  private _message_type: string;
  private _content: string;
  private _time_stamp: string;
  private _location: string;

  constructor(object: any) {
    this._user_id = object && object.user_id || object && object._user_id || undefined;
    this._message_type = object && object.message_type || object && object._message_type || undefined;
    this._content = object && object.content || object && object._content || undefined;
    this._time_stamp = object && object.time_stamp || object && object._time_stamp || undefined;
    this._location = object && object.location || object && object._location || undefined;
  }

	public get user_id(): string {
		return this._user_id;
	}

	public set user_id(value: string) {
		this._user_id = value;
	}

	public get message_type(): string {
		return this._message_type;
	}

	public set message_type(value: string) {
		this._message_type = value;
	}

	public get content(): string {
		return this._content;
	}

	public set content(value: string) {
		this._content = value;
	}

	public get time_stamp(): string {
		return this._time_stamp;
	}

	public set time_stamp(value: string) {
		this._time_stamp = value;
	}

	public get location(): string {
		return this._location;
	}

	public set location(value: string) {
		this._location = value;
	}
}
