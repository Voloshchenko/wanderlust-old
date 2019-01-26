import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { ReactiveFormsModule} from "@angular/forms";
import { FormsModule } from '@angular/forms';

// Third parties
import { AngularFireModule } from 'angularfire2';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyDateRangePickerModule } from 'mydaterangepicker';
import { MyDatePickerModule } from 'mydatepicker';
// Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
// Components
import { AppComponent } from './app.component';
// Login
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { SignUpComponent } from './components/login/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login/login.component';
import { EmailComponent } from './components/login/email/email.component';
// Profile
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
// Trip
import { TripComponent } from './components/trip/trip-page/trip.component';
import { AddTripComponent } from './components/trip/add-trip/add-trip.component';

// Services
import {AuthGuard } from './services/AuthGuard.service';
import {AuthService} from './services/authorization.service';
import {ManipulationService} from './services/manipulation.service';
import {TripFunctionsService} from './services/trip-functions.service';
import {FindFriendsService} from './services/find-friends.service';
import {ModalSupportService} from './services/modal-support.service';
import {BudgetService} from './services/budget.service';
import {FriendsListService} from './services/friends-list.service';


import { routes } from './routes/app.routes';

import {MatDialogModule} from '@angular/material';
import { FullViewComponent } from './components/trip/trip-page/full-view/full-view.component';
import { AddCityComponent } from './components/trip/trip-page/add-city/add-city.component';
import { CityComponent } from './components/trip/trip-page/full-view/city/city.component';
import { TransportComponent } from './components/trip/trip-page/full-view/transport/transport.component';
import { EditTransportComponent } from './components/trip/trip-page/full-view/transport/edit-transport/edit-transport.component';
import { EditCityComponent } from './components/trip/trip-page/full-view/city/edit-city/edit-city.component';
import { AddTransportComponent } from './components/trip/trip-page/full-view/transport/add-transport/add-transport.component';
import { UserPageComponent } from './components/profile-page/user-page/user-page.component';
import { AddAccommodationComponent } from './components/trip/trip-page/full-view/city/accommodation/add-accommodation/add-accommodation.component';
import { AccommodationComponent } from './components/trip/trip-page/full-view/city/accommodation/accommodation/accommodation.component';
import { EditAccommodationComponent } from './components/trip/trip-page/full-view/city/accommodation/edit-accommodation/edit-accommodation.component';
import { NotesPageComponent } from './components/trip/trip-page/full-view/notes/notes-page/notes-page.component';
import { BudgetComponent } from './components/trip/trip-page/budget/budget.component';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { TripManagerComponent } from './components/trip-manager/trip-manager.component';
import { TripSettingsComponent } from './components/trip/trip-settings/trip-settings.component';
import { StoryComponent } from './components/trip/story/story.component';
import { TimelineComponent } from './components/trip/trip-page/timeline/timeline.component';
import { MapComponent } from './components/trip/trip-page/full-view/city/accommodation/map/map.component';
import { DialogComponent } from './components/trip/trip-page/dialog/dialog.component';
import { ToDoComponent } from './components/trip/trip-page/to-do/to-do.component';
import { FriendsComponent } from './components/helpers/friends/friends.component';
import { PeronalInformationComponent } from './components/profile-page/peronal-information/peronal-information.component';
import { VisaEditComponent } from './components/profile-page/visa-edit/visa-edit.component';
import { VisaAddComponent } from './components/profile-page/visa-add/visa-add.component';
import { FriendsPageComponent } from './components/friends-page/friends-page.component';
import { TripMembersComponent } from './components/trip-manager/trip-members/trip-members.component';
import { NewsfeedComponent } from './components/newsfeed/newsfeed.component';
import { MessagesComponent } from './components/messages/messages.component';
import { GroupsComponent } from './components/groups/groups.component';
import { FriendsManagerComponent } from './components/trip/friends-manager/friends-manager.component';
import { NewPostComponent } from './components/trip/new-post/new-post.component';






export const firebaseConfig = {
  apiKey: "AIzaSyBLI5hfENJ_3m1b_1TxyuYapL0WsqMTSDs",
  authDomain: "wanderlustapp-822a0.firebaseapp.com",
  databaseURL: "https://wanderlustapp-822a0.firebaseio.com",
  storageBucket:  "wanderlustapp-822a0.appspot.com",
  messagingSenderId: "827062275030"
};

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    EmailComponent,
    ProfilePageComponent,
    NavbarComponent,
    LoginPageComponent,
    TripComponent,
    AddTripComponent,
    FullViewComponent,
    AddCityComponent,
    CityComponent,
    TransportComponent,
    EditTransportComponent,
    EditCityComponent,
    AddTransportComponent,
    UserPageComponent,
    AddAccommodationComponent,
    AccommodationComponent,
    EditAccommodationComponent,
    NotesPageComponent,
    BudgetComponent,
    TripManagerComponent,
    TripSettingsComponent,
    StoryComponent,
    TimelineComponent,
    MapComponent,
    DialogComponent,
    ToDoComponent,
    FriendsComponent,
    PeronalInformationComponent,
    VisaEditComponent,
    VisaAddComponent,
    FriendsPageComponent,
    TripMembersComponent,
    NewsfeedComponent,
    MessagesComponent,
    GroupsComponent,
    FriendsManagerComponent,
    NewPostComponent,
  ],
  imports: [    AgmCoreModule.forRoot({
            apiKey: "AIzaSyDeVbDg1GKf61T-NJWVrjS7MadfrDdm6qE",
      libraries: ["places"]
    }),
    Ng4GeoautocompleteModule.forRoot(),
    MyDateRangePickerModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    routes,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    MatDialogModule,
    TimepickerModule.forRoot(),
    InfiniteScrollModule,
  ],
  entryComponents: [AddTripComponent,
                    AddCityComponent,
                    EditTransportComponent,
                    EditCityComponent,
                    AddTransportComponent,
                    AddAccommodationComponent,
                    EditAccommodationComponent,
                    NotesPageComponent,
                    TripSettingsComponent,
                    MapComponent,
                    VisaEditComponent,
                    VisaAddComponent,
                    FriendsManagerComponent,
                    NewPostComponent
  ],
  providers: [AuthGuard, 
              AuthService,
              ManipulationService,
              TripFunctionsService,
              FindFriendsService,
              ModalSupportService,
              BudgetService,
              FriendsListService
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
