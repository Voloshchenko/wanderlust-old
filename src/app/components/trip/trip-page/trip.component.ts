import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {AuthService} from '../../../services/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {ManipulationService} from '../../../services/manipulation.service';
import {ModalSupportService} from '../../../services/modal-support.service';


@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit, OnDestroy {
	showFullInfo = true;
  trip; tripId; tripName; 
  subscription; tripRout
  budget = true
  toDoList = true
  members

  @ViewChild(ModalDirective) public modal: ModalDirective;

  constructor(public manipulate:ManipulationService,
              public afAuth: AuthService,
  	          private route: ActivatedRoute,
              private router: Router,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService) { }

  ngOnInit() { 
   //  this.db.object(`trips/${this.tripId}/members`).subscribe(members=>{
   //      this.members = members
   //      console.log(members.length)
   //  }).unsubscribe()
   // console.log(this.members)
 	  this.route.params.subscribe(params=>{this.trip = this.db.object('/trips/'+params['tripName'])          
         this.db.object(`trips/${params['tripName']}`)
         .subscribe(tripSnapShot=>{           
           this.members = Object.keys(tripSnapShot.members).length
         })          
         return this.tripId = params['tripName']          
 	    })
  }



  public showModal(tripName) {
    this.modal.show();
    this.tripName = tripName  
  }  
  
  // Dont delete trip details 
  delete(){
     this.subscription = this.db.object(`trips/${this.tripId}`).subscribe(items=>{
            
       if(Object.keys(items.members).length == 1){
          this.db.list('trips/').remove(this.tripId);
          this.db.list(`users/${this.afAuth.currentUserId}/trips`).remove(this.tripId)
          this.db.list(`budget/${this.afAuth.currentUserId}`).remove(this.tripId)
          var tripDetailsArr = Object.keys(items.tripDetails)
          for (var i = 0; i< tripDetailsArr.length ; i++) {
            this.db.list(`tripDetails`).remove(tripDetailsArr[i])                 
          }  
       }else if (Object.keys(items.members).length > 1){
         this.db.list(`users/${this.afAuth.currentUserId}/trips`).remove(this.tripId)
         this.db.list(`trips/${this.tripId}/members`).remove(this.afAuth.currentUserId)
         this.db.list(`budget/${this.afAuth.currentUserId}`).remove(this.tripId) 
       }

     }).unsubscribe()
    this.router.navigate(['/user']);    
  }
  toggleBudget(){
    this.budget = !this.budget
  }

  toggleToDoList(){
    this.toDoList = !this.toDoList
  }

  toggleFullInfo(){
    this.showFullInfo = !this.showFullInfo
  }
  ngOnDestroy(){

  }
}
