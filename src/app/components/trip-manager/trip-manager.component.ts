import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../../services/authorization.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {ManipulationService} from '../../services/manipulation.service';
import { Observable } from 'rxjs/Observable';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {TripFunctionsService} from '../../services/trip-functions.service'
@Component({
  selector: 'app-trip-manager',
  templateUrl: './trip-manager.component.html',
  styleUrls: ['./trip-manager.component.css']
})
export class TripManagerComponent implements OnInit {
  user: FirebaseObjectObservable<any>;
  @ViewChild(ModalDirective) public modal: ModalDirective;

  tripsKey: Array<any>;
  trips: Array<any> = [];
  userId
  tripsKeyTrue = []

  pastTrips: Array<any> = [];
  pendingTrips: Array<any> = [];
  upcomingTrips: Array<any> = [];
  pendTripId
  with = []

  constructor(public manipulate:ManipulationService,
              public afAuth: AuthService,
              private db: AngularFireDatabase,
              public tripFunction: TripFunctionsService) { }

  ngOnInit() {
    const today = new Date();
    this.userId = this.afAuth.currentUserId 
    this.user = this.db.object(`/users/${this.afAuth.currentUserId}`);
    this.user.subscribe(user =>{
      if(user.trips){
      this.tripsKey = Object.keys(user.trips); 
      this.tripsKey.forEach(key => { 
      if(user.trips[key] == true){
        let tripObservable = this.db.object(`/trips/${key}`);
        tripObservable.subscribe(trip => {
          if(new Date(trip.range.endJsDate)<today){
            if(this.pastTrips.length==0){
              this.pastTrips.push(trip);
            } else {
              for(var i=0; i<this.pastTrips.length; i++){
                if (this.pastTrips[i].$key == trip.$key) {
                  this.pastTrips.splice(i, 1)
                }                          
              }
              this.pastTrips.push(trip);                
             }
            this.pastTrips.sort(function(a, b){return (a.range.beginJsDate > b.range.beginJsDate) ? 1 :(( a.range.beginJsDate < b.range.beginJsDate)?-1:0)})
          }
          if(new Date(trip.range.endJsDate)>=today){
            if(this.upcomingTrips.length==0){
              this.upcomingTrips.push(trip);
            } else {
              for(var i=0; i<this.upcomingTrips.length; i++){               
                if (this.upcomingTrips[i].$key == trip.$key) {
                  this.upcomingTrips.splice(i, 1)
                }                          
              }

              this.upcomingTrips.push(trip);         
             }
            this.upcomingTrips.sort(function(a, b){return (a.range.beginJsDate > b.range.beginJsDate) ? 1 :(( a.range.beginJsDate < b.range.beginJsDate)?-1:0)})
          }
        })
      }
      if(user.trips[key] == false){           
            let tripObservable = this.db.object(`/trips/${key}`);
            tripObservable.subscribe(trip => {
              if(this.pendingTrips.length==0){
                this.pendingTrips.push(trip);
              } else {
                for(var i=0; i<this.pendingTrips.length; i++){
                  if (this.pendingTrips[i].$key == trip.$key) {
                    this.pendingTrips.splice(i, 1)
                  }                          
                }
                
                this.pendingTrips.push(trip);             
              }
              this.pendingTrips.sort(function(a, b){return (a.range.beginJsDate > b.range.beginJsDate) ? 1 :(( a.range.beginJsDate < b.range.beginJsDate)?-1:0)})           
            })
          }  
      })
      }
    })     
  }

  removeFromPendTrip(tripId){
    for(var i=0; i<this.pendingTrips.length; i++){
      if (this.pendingTrips[i].$key == tripId) {
        this.pendingTrips.splice(i, 1)
      }                          
    }
  }

  pendTripInfo(tripId){
    this.tripFunction.tripDetails = []
    this.pendTripId = tripId
    this.modal.show();
    this.tripFunction.showTripInfo(tripId)   
  }

  accept(tripId){
    this.userId = this.afAuth.currentUserId
    this.db.object(`/users/${this.afAuth.currentUserId}/trips`)
      .update({[tripId]:true})
    this.db.object(`/trips/${tripId}/members`)
      .update({[this.userId]:true})
    this.removeFromPendTrip(tripId)      
  }

  decline(tripId){
    this.userId = this.afAuth.currentUserId
    this.db.object(`/users/${this.afAuth.currentUserId}/trips/${tripId}`)
      .remove()
    this.db.object(`/trips/${tripId}/members/${this.afAuth.currentUserId}`)
      .remove()
    this.removeFromPendTrip(tripId)           
  }
}
