import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from '../app.component';
import { LoginPageComponent } from '../components/login/login-page/login-page.component';
import { SignUpComponent } from '../components/login/sign-up/sign-up.component';
import { EmailComponent } from '../components/login/email/email.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { TripComponent } from '../components/trip/trip-page/trip.component';
import { UserPageComponent } from '../components/profile-page/user-page/user-page.component';
import { TripManagerComponent } from '../components/trip-manager/trip-manager.component';
import { StoryComponent } from '../components/trip/story/story.component';
import { FriendsPageComponent } from '../components/friends-page/friends-page.component';
import { NewsfeedComponent } from '../components/newsfeed/newsfeed.component';
import { MessagesComponent } from '../components/messages/messages.component';
import { GroupsComponent } from '../components/groups/groups.component';


import {AuthGuard } from '../services/AuthGuard.service';
import {AuthService} from '../services/authorization.service';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'user', pathMatch: 'full', component: ProfilePageComponent, canActivate: [AuthGuard] }, 
    { path: 'tripManager', pathMatch: 'full', component: TripManagerComponent, canActivate: [AuthGuard]},  
    { path: 'newsfeed', pathMatch: 'full', component: NewsfeedComponent, canActivate: [AuthGuard]},
    { path: 'messages', pathMatch: 'full', component: MessagesComponent, canActivate: [AuthGuard]},
    { path: 'groups', pathMatch: 'full', component: GroupsComponent, canActivate: [AuthGuard]},                      
    { path: 'trip/:tripName', pathMatch: 'full', component: TripComponent, canActivate: [AuthGuard] },    
    { path: 'profile/:userId', pathMatch: 'full', component: UserPageComponent, canActivate: [AuthGuard]},
    { path: 'story/:tripName', pathMatch: 'full', component: StoryComponent, canActivate: [AuthGuard] },    
    { path: 'friends/:userId', pathMatch: 'full', component: FriendsPageComponent, canActivate: [AuthGuard] },    

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);