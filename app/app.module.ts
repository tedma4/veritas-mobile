import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import {SessionService} from "./services/sessions/session.service";
import {ImageService} from "./services/images/image.service";
import {MapService} from "./services/maps/map.service"; 

import { AuthGuard } from "./auth-guard.service";
import { AppComponent } from "./app.component";
import { routes, navigatableComponents } from "./app.routing";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ...navigatableComponents
  ],
  providers: [SessionService, ImageService, MapService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}