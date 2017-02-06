import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LandingComponent } from './pages/landing/landing.component';
import { FriendListComponent } from './pages/friend-list/friend-list.component';
import { SearchUserComponent } from './pages/search-user/search-user.component';
import { GoogleMapComponent } from './pages/map/google-map.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PinComponent } from './pages/signup/pin.component';
import { PostComponent } from './pages/post/post.component';
import { PostPreviewComponent } from './pages/post-preview/post-preview.component';
import { PostUserSelectionComponent } from './pages/post-user-selection/post-user-selection.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { MemoryFriendSelectorComponent } from './pages/memory-friend-selector/memory-friend-selector.component';
import { MemoryGalleryComponent } from './pages/memory-gallery/memory-gallery.component';

import { AuthGuard } from "./auth-guard.service";

export const routes = [
  { path: "", redirectTo: "/landing", pathMatch: "full" },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'landing', component: LandingComponent, canActivate: [AuthGuard]},
  { path: 'friend-list', component: FriendListComponent, canActivate: [AuthGuard]},
  { path: 'search-user', component: SearchUserComponent, canActivate: [AuthGuard]},
  { path: 'google-map', component: GoogleMapComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'pin', component: PinComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'post', component: PostComponent, canActivate: [AuthGuard]},
  { path: 'post-preview', component: PostPreviewComponent, canActivate: [AuthGuard]},
  { path: 'post-user-selection', component: PostUserSelectionComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'memory-friend-selector', component: MemoryFriendSelectorComponent, canActivate: [AuthGuard]},
  { path: 'memory-gallery/:friendId', component: MemoryGalleryComponent, canActivate: [AuthGuard]}
];

export const navigatableComponents = [
  WelcomeComponent,
  LandingComponent,
  FriendListComponent,
  SearchUserComponent,
  GoogleMapComponent,
  LoginComponent,
  PinComponent,
  SignupComponent,
  PostComponent,
  PostPreviewComponent,
  PostUserSelectionComponent,
  HomeComponent,
  SettingsComponent,
  NotificationsComponent,
  MemoryFriendSelectorComponent,
  MemoryGalleryComponent
];