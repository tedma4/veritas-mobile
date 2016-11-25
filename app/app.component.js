"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var platform = require("platform");
var GMSServiceKey = require('./GMSServiceKey');
var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () {
        if (platform.isIOS) {
            GMSServiceKey();
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "main",
            template: "<page-router-outlet></page-router-outlet>"
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map