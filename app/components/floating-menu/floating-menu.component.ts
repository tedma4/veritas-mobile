import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import {SessionService} from "../../services/sessions/session.service";
import {Color} from "color";
import {Page} from "ui/page";
import dockLayoutModule = require('ui/layouts/dock-layout');
import stackLayoutModule = require('ui/layouts/stack-layout');
import animationModule = require('ui/animation');
import platformModule = require("platform");
import {screen} from 'platform';
var enums = require("ui/enums");

@Component({
  selector: "floating-menu",
  styleUrls: ['components/floating-menu/floating-menu.component.css', 'app.css'],
  templateUrl: 'components/floating-menu/floating-menu.component.html'
})
export class FloatingMenuComponent implements OnInit{
  public showBackgroundMenu: string = 'collapsed';
  private isMenuOpen: boolean = false;

  private menuElementAnimation:any = {
    curve: enums.AnimationCurve.easeInOut,
    duration: 300
  };

  constructor(
    private page: Page,
    private _sessionService: SessionService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit() {
  }

  public toggleMenu(event){
    if(this.isMenuOpen){
      this.isMenuOpen = false;
      this.hideMenu(event);
    }else{
      this.isMenuOpen = true;
      this.displayMenu(event);
    }
  }

  private displayMenu(event){
    this.showBackgroundMenu = 'visible';
    let definitions = new Array();
    definitions = this.defineMenuAnimation('display');
    definitions.push(this.defineBackgroundAnimation('display'));
    var animationSet = new animationModule.Animation(definitions);
    animationSet.play().then(() => {
    }).catch((e) => {
      console.log(e.message);
    });
  }

  private hideMenu(event:any){
    console.log(event);
    var definitions = new Array();
    definitions = this.defineMenuAnimation('hide');
    definitions.push(this.defineBackgroundAnimation('hide'));
    var animationSet = new animationModule.Animation(definitions);
    animationSet.play().then(() => {
      this.showBackgroundMenu = 'collapsed';
      if(event){
        this.routerExtensions.navigate([event], { animated: false });
      }
    }).catch((e) => {
      console.log(e.message);
      this.showBackgroundMenu = 'collapsed';
      if(event){
        this.routerExtensions.navigate([event], { animated: false });
      }
    });
  }

  private defineMenuAnimation(type: string){
    let definitions = new Array();
    let menuElements = [1,2,3,4,5];
    menuElements.forEach((element) =>{
      let uiElement = 
        this.page.getViewById('option' + element) as stackLayoutModule.StackLayout;
      let elementAnimation = Object.create(this.menuElementAnimation);
      elementAnimation.target = uiElement;
      elementAnimation.translate =
        type === 'display' ? {x: 0, y: -30} : {x: 0, y: 30};
      definitions.push(elementAnimation);
    });
    return definitions;
  }

  private defineBackgroundAnimation(type: string){
    let backgroundStack =
      this.page.getViewById('menuBackground') as dockLayoutModule.DockLayout;
    let animation:any = {
      target: backgroundStack,
      duration: 300
    };
    if(type === 'display'){
      animation.backgroundColor = new Color("#000000"),
      animation.opacity = 0.8
    }else{
      animation.backgroundColor = new Color("#FFFFFF"),
      animation.opacity = 0
    }
    return animation;
  }

  public logOut(){
    this._sessionService.logOut();
    this.routerExtensions.navigate(["/welcome"], {animated: false, clearHistory: true});
  }
}
