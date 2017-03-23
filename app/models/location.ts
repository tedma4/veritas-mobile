interface LocationJSON {
  latitude: string;
  longitude: string;
}

export class Location {
  private _latitude: string;
  private _longitude: string;

  constructor(object: any) {
    this._latitude = object && object.latitude || object && object._latitude || undefined;
    this._longitude = object && object.longitude || object && object._longitude || undefined;
  }

  public get latitude(): string {
    return this._latitude;
  }

  public set latitude(value: string) {
    this._latitude = value;
  }

  public get longitude(): string {
    return this._longitude;
  }

  public set longitude(value: string) {
    this._longitude = value;
  }
} 