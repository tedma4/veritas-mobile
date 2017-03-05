import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';

@Injectable()
export class HttpInterceptorService {
  private _jwt:string;
  constructor(
    private _http: Http
  ) {}

	public get jwt(): string {
		return this._jwt;
	}

	public set jwt(value: string) {
		this._jwt = value;
	}

  private createAuthorizationHeader(headers: Headers) {
    if(this._jwt){
      headers.append('Authorization', this._jwt);
    }
  }

  public get(url:string, parameters:URLSearchParams) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    this.createAuthorizationHeader(headers);
    return this._http.get(url, {
      headers:headers, search:parameters
    });
  }

  public post(url:string, body:any) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    this.createAuthorizationHeader(headers);
    return this._http.post(url, JSON.stringify(body), {headers: headers});
  }

  public patch(url:string, body:any) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    this.createAuthorizationHeader(headers);
    return this._http.patch(url, JSON.stringify(body), {headers: headers});
  }

  public delete(url:string, parameters:URLSearchParams) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    this.createAuthorizationHeader(headers);
    return this._http.delete(url, {headers:headers, search:parameters});
  }
}