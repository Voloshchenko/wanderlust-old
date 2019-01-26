import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {TripFunctionsService} from '../../../services/trip-functions.service';
import {FindFriendsService} from '../../../services/find-friends.service';
import {ModalSupportService} from '../../../services/modal-support.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../../services/authorization.service';

import {Subject} from 'rxjs/Subject'

@Component({
  selector: 'friends-manager',
  templateUrl: './friends-manager.component.html',
  styleUrls: ['./friends-manager.component.css']
})
export class FriendsManagerComponent implements OnInit {

//Add friends to the trip variables 
  members = []
  startsAt = new Subject()
  endAt = new Subject()
  users
  addedUser = {}
  output = false
  tripFriends
  newMembers = []
  removedMembers = []

  constructor(public bsModalRef: BsModalRef,
 	          private fb: FormBuilder,
              private db: AngularFireDatabase,
              private tripFunct:TripFunctionsService,
              public modalSupport: ModalSupportService,
              private router: Router,
              public afAuth: AuthService,
              public findFriends: FindFriendsService) { }

// Look for friends in the form
  search($event){
    this.output = true
    let q = $event.target.value
    this.startsAt.next(q)
    this.endAt.next(q+"\uf8ff")
  }

  inviteFriendsToTrip(userId, name){
    this.output = false
    this.addedUser = {"userName": name, "userId":userId }
    this.newMembers.push( this.addedUser)
    console.log(this.newMembers)
  }

  removeFriend(index) {
  	this.removedMembers.push(this.members[index])
    this.members.splice(index, 1)
    console.log(this.removedMembers)
  }

  removeNewFriend(index){
    this.newMembers.splice(index, 1)
  }

  hideOutput(){
    this.output = false
  }

  ngOnInit() {
  	this.findFriends.getUsers(this.startsAt, this.endAt)
  	.subscribe(users=>
  	{this.users = users
  	}

  		)  
  	this.db.object(`trips/${this.modalSupport.tripId}`)
  	.subscribe(tripSnapShot=>{
  		if(tripSnapShot.members != undefined){
           this.tripFriends = Object.keys(tripSnapShot.members)           
           for (var i = 0; this.tripFriends.length > i; i++){
           	 this.db.object(`users/${this.tripFriends[i]}`)
           	   .subscribe(userSnapShot=>{
           	   	console.log(userSnapShot.$key)
               this.members.push({
               	"userId": userSnapShot.$key,
               	"userName": userSnapShot.name,
               	"imgUrl": userSnapShot.imgUrl
               })
           	 })
           }
        }
    }) 
  }

  addFriends(){
  	if(this.newMembers.length != 0){
      this.tripFunct.addFriendsToTrip(this.newMembers, this.modalSupport.tripId)
  	}
  	if(this.removedMembers.length != 0){
  		for (var i = 0; this.removedMembers.length > i; i++) {
  			this.db.list(`users/${this.removedMembers[i].userId}/trips`).remove(this.modalSupport.tripId)
  			this.db.list(`trips/${this.modalSupport.tripId}/members`).remove(this.removedMembers[i].userId)  			 	
  		}  	
  	}
    
    this.bsModalRef.hide()
  }

}
