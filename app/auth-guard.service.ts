import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { RouterExtensions } from "nativescript-angular/router";
import { SessionService } from "./services/sessions/session.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private routerExtensions: RouterExtensions,
    private sessionService: SessionService
  ) { }

  canActivate() {
    if (this.sessionService.getCurrentSession()) {
      return true;
    }
    else {
      this.routerExtensions.navigate(["/welcome"], { animated: false });
      return false;
    }
  }
}