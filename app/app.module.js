"use strict";
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var platform_1 = require("nativescript-angular/platform");
var router_1 = require("nativescript-angular/router");
var navigation_bar_component_1 = require('./components/navigation-bar/navigation-bar.component');
var session_service_1 = require("./services/sessions/session.service");
var image_service_1 = require("./services/images/image.service");
var auth_guard_service_1 = require("./auth-guard.service");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.routes)
            ],
            declarations: [
                app_component_1.AppComponent,
                navigation_bar_component_1.NavigationBarComponent
            ].concat(app_routing_1.navigatableComponents),
            providers: [session_service_1.SessionService, image_service_1.ImageService, auth_guard_service_1.AuthGuard],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map