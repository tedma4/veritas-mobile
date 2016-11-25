"use strict";
var welcome_component_1 = require('./pages/welcome/welcome.component');
var landing_component_1 = require('./pages/landing/landing.component');
var friend_list_component_1 = require('./pages/friend-list/friend-list.component');
var search_user_component_1 = require('./pages/search-user/search-user.component');
var google_map_component_1 = require('./pages/map/google-map.component');
var login_component_1 = require('./pages/login/login.component');
var signup_component_1 = require('./pages/signup/signup.component');
var pin_component_1 = require('./pages/signup/pin.component');
var post_component_1 = require('./pages/post/post.component');
var home_component_1 = require('./pages/home/home.component');
var settings_component_1 = require('./pages/settings/settings.component');
var notifications_component_1 = require('./pages/notifications/notifications.component');
var auth_guard_service_1 = require("./auth-guard.service");
exports.routes = [
    { path: "", redirectTo: "/landing", pathMatch: "full" },
    { path: 'welcome', component: welcome_component_1.WelcomeComponent },
    { path: 'landing', component: landing_component_1.LandingComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'friend-list', component: friend_list_component_1.FriendListComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'search-user', component: search_user_component_1.SearchUserComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'google-map', component: google_map_component_1.GoogleMapComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'pin', component: pin_component_1.PinComponent },
    { path: 'signup', component: signup_component_1.SignupComponent },
    { path: 'post', component: post_component_1.PostComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'home', component: home_component_1.HomeComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'settings', component: settings_component_1.SettingsComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'notifications', component: notifications_component_1.NotificationsComponent, canActivate: [auth_guard_service_1.AuthGuard] }
];
exports.navigatableComponents = [
    welcome_component_1.WelcomeComponent,
    landing_component_1.LandingComponent,
    friend_list_component_1.FriendListComponent,
    search_user_component_1.SearchUserComponent,
    google_map_component_1.GoogleMapComponent,
    login_component_1.LoginComponent,
    pin_component_1.PinComponent,
    signup_component_1.SignupComponent,
    post_component_1.PostComponent,
    home_component_1.HomeComponent,
    settings_component_1.SettingsComponent,
    notifications_component_1.NotificationsComponent
];
//# sourceMappingURL=app.routing.js.map