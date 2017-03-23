export class Message {
  private _id: string;
  private _user_id: string;
  private _message_type: string;
  private _text: string;

  constructor(object: any) {
    this._id = object && object.id || object && object._id || undefined;
    this._user_id = object && object.user_id || object && object._user_id || undefined;
    this._message_type = object && object.message_type || object && object._message_type || undefined;
    this._text = object && object.text || object && object._text || undefined;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
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

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
  }
}
