import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {AddTripComponent} from '../components/trip/add-trip/add-trip.component'
import {AddCityComponent} from '../components/trip/trip-page/add-city/add-city.component'
import { EditTransportComponent } from '../components/trip/trip-page/full-view/transport/edit-transport/edit-transport.component';
import { EditCityComponent } from '../components/trip/trip-page/full-view/city/edit-city/edit-city.component';
import { AddTransportComponent } from '../components/trip/trip-page/full-view/transport/add-transport/add-transport.component';
import { AddAccommodationComponent } from '../components/trip/trip-page/full-view/city/accommodation/add-accommodation/add-accommodation.component';
import { EditAccommodationComponent } from '../components/trip/trip-page/full-view/city/accommodation/edit-accommodation/edit-accommodation.component';
import { NotesPageComponent } from '../components/trip/trip-page/full-view/notes/notes-page/notes-page.component';
import { TripSettingsComponent } from '../components/trip/trip-settings/trip-settings.component';
import { FriendsManagerComponent } from '../components/trip/friends-manager/friends-manager.component';
import { MapComponent } from '../components/trip/trip-page/full-view/city/accommodation/map/map.component'; 
import { NewPostComponent } from '../components/trip/new-post/new-post.component';

import { VisaAddComponent } from '../components/profile-page/visa-add/visa-add.component';
import { VisaEditComponent } from '../components/profile-page/visa-edit/visa-edit.component';


@Injectable()
export class ManipulationService {
  bsModalRef: BsModalRef;
  login = true;
  editPInfo = false

  constructor(private modalService: BsModalService) { }

  loginToggle(){
    this.login = !this.login;
  }
//TRIP
  newTrip(){
    this.bsModalRef = this.modalService.show(AddTripComponent);
  }

  addCity(){
    this.bsModalRef = this.modalService.show(AddCityComponent);
  }

  addTransport(){
    this.bsModalRef = this.modalService.show(AddTransportComponent);            
  }

  editTransport(){
    this.bsModalRef = this.modalService.show(EditTransportComponent);          
  }
  
  editCity(){
    this.bsModalRef = this.modalService.show(EditCityComponent);   
  } 

  addAccommodation(){
    this.bsModalRef = this.modalService.show(AddAccommodationComponent);   
  } 
  editAccommodation(){
    this.bsModalRef = this.modalService.show(EditAccommodationComponent);     
  } 

  showNotes(){
    this.bsModalRef = this.modalService.show(NotesPageComponent);   
  }  
  tripSettings(){
    this.bsModalRef = this.modalService.show(TripSettingsComponent);    
  }

  tripFriends(){
    this.bsModalRef = this.modalService.show(FriendsManagerComponent);     
  }
  
    mapAccom(){
    this.bsModalRef = this.modalService.show(MapComponent);    
  }

  togglepersonalnfo(){
    this.editPInfo = !this.editPInfo
  }

  addVisa(){
    this.bsModalRef = this.modalService.show(VisaAddComponent);        
  }

  editVisa(){
    this.bsModalRef = this.modalService.show(VisaEditComponent);        
  }  

  newPost() {
    this.bsModalRef = this.modalService.show(NewPostComponent);    
  }
}

