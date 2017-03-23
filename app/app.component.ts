import { Component, OnInit} from "@angular/core";
import { Router} from "@angular/router";
import {MapService} from "./services/maps/map.service";
import platform = require("platform");
import {SessionService} from "./services/sessions/session.service";
import {ChatDataService} from "./services/chat/chat-data.service";
import GMSServiceKey = require('./GMSServiceKey');

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {
  constructor(
    private _sessionService: SessionService,
    private _chatDataService: ChatDataService,
    private router: Router
  ){}

  ngOnInit() {
    if(platform.isIOS){
      GMSServiceKey();
    }
    this._sessionService.turnOnLocation();
    this._chatDataService.initChatService();
  }
}
