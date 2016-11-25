"use strict";
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var session_service_1 = require("./services/sessions/session.service");
var AuthGuard = (function () {
    function AuthGuard(routerExtensions, sessionService) {
        this.routerExtensions = routerExtensions;
        this.sessionService = sessionService;
    }
    AuthGuard.prototype.canActivate = function () {
        if (this.sessionService.getCurrentSession()) {
            return true;
        }
        else {
            this.routerExtensions.navigate(["/welcome"], { animated: false });
            return false;
        }
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.RouterExtensions, session_service_1.SessionService])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map