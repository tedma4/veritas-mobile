import {Component, OnInit, ViewChild} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import {Color} from "color";
import {Page} from "ui/page";

@Component({
  selector: "chat",
  styleUrls: ['pages/chat/chat.component.css', 'app.css'],
  templateUrl: 'pages/chat/chat.component.html'
})
export class ChatComponent implements OnInit{

  constructor(
    private routerExtensions: RouterExtensions,
    private page: Page
  ) {}

  ngOnInit() {
    this.page.backgroundColor = new Color('#333333');
  }

  public goBack():void{
    this.routerExtensions.backToPreviousPage();
  }
}
