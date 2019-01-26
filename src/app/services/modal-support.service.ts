import { Injectable } from '@angular/core';
import {AuthService} from './authorization.service';

@Injectable()
export class ModalSupportService {
  userId
  tripId
  cityId
  transportId
  tripDetailId
  accommodationId
  index
  type
  latitude
  longitude
  visaId
  
  constructor(public afAuth: AuthService) { }

  addCity(tripId){
    this.tripId = tripId;    
  }

  editCity(cityId, tripId){
  	this.tripId = tripId;  	
  	this.cityId = cityId;
  }

  addTransport(tripId, index){
    this.tripId = tripId;
    this.index = index;
  }

  editTransport(transportId, index, tripId){
    this.transportId = transportId;
    this.index = index
    this.tripId = tripId
    this.userId = this.afAuth.currentUserId
  }
    
  addAccommodation(cityId, tripId){
  	this.cityId = cityId;
    this.tripId = tripId
  }

  editAccommodation(accommodationId, tripDetailId, tripId){
    this.accommodationId = accommodationId;
    this.tripId = tripId
    this.tripDetailId = tripDetailId
    this.userId = this.afAuth.currentUserId    
  }

  showNotes(tripId, cityId){
    this.tripId = tripId
    this.cityId = cityId;  
  } 
  tripSettings(tripId){
    this.tripId = tripId
  }

  tripFriends(tripId){
    this.tripId = tripId
  }

  mapAccom(latitude, longitude){
      this.latitude = latitude;
      this.longitude = longitude;
  }

  addVisa(currentUserId) {
    this.userId = currentUserId      
  }

  editVisa(currentUserId, visaId) {
    this.userId = currentUserId 
    this.visaId = visaId
  }

  newPost(tripId, userId){
    this.tripId = tripId  
    this.userId = userId   
  }
}
