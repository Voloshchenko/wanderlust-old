import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {ModalSupportService} from '../../../../../../services/modal-support.service';
import {AuthService} from '../../../../../../services/authorization.service';
import {TripFunctionsService} from '../../../../../../services/trip-functions.service'

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.css']
})
export class NotesPageComponent implements OnInit {

  edit = false;
  cityId 

  // imported valuess
  tripDetailId
  userId
  tripDetails
  tripId

  // toggle elements
  publicNotes = false
  personalNotes = true;
  newBasicInput = true;

  personalNote
  publicNote
  title
  basicNotes
  basicNote
  basicNoteId

  constructor(public bsModalRef: BsModalRef,
              private db: AngularFireDatabase,
              public modalSupport: ModalSupportService, 
              public afAuth: AuthService, 
              public tripFunction: TripFunctionsService) { }

  ngOnInit() {
    this.tripId = this.modalSupport.tripId;
    this.userId = this.afAuth.currentUserId;     
    this.tripDetails = this.tripFunction.tripDetails
  	this.tripDetailId = this.modalSupport.cityId

    this.db.list(`basicNotes/${this.tripId}/${this.userId}`)
    .subscribe(basicNotesSnapshot =>{       
         this.basicNotes = basicNotesSnapshot   
    }).unsubscribe

 	  if(this.tripDetailId){
       this.newBasicInput = false;  
     }

    this.db.object(`tripDetails/${this.tripDetailId}`)
    .subscribe(citySnapshot =>{
        if(citySnapshot.type == 'city'){
         this.title = citySnapshot.cityName  
       } else if(citySnapshot.type == 'transport'){
         this.title = citySnapshot.fromCity.split(',', 1) + "-" + citySnapshot.toCity.split(',', 1)
       }           
    }).unsubscribe

    this.db.object(`tripDetails/${this.tripDetailId}/personalNotes/${ this.userId}`)
    .subscribe(citySnapshot =>{
        this.personalNote =  citySnapshot.$value     
    }).unsubscribe

    this.db.object(`tripDetails/${this.tripDetailId}`).subscribe(citySnapshot =>{
      this.publicNote = citySnapshot.publicNote   
    }).unsubscribe
  }

  newBasicNote(){
    this.newBasicInput = true;
  }

  showDetailNote(tripDetailId){
    this.tripDetailId = tripDetailId
    this.newBasicInput = false;
    this.userId = this.afAuth.currentUserId;

    this.db.object(`tripDetails/${tripDetailId}`)
    .subscribe(citySnapshot =>{
        if(citySnapshot.type == 'city'){
         this.title = citySnapshot.cityName  
       } else if(citySnapshot.type == 'transport'){
         this.title = citySnapshot.fromCity + "-" + citySnapshot.toCity
       }           
    }).unsubscribe

    this.db.object(`tripDetails/${tripDetailId}/personalNotes/${ this.userId}`)
    .subscribe(citySnapshot =>{
        this.personalNote =  citySnapshot.$value     
    }).unsubscribe

    this.db.object(`tripDetails/${tripDetailId}`).subscribe(citySnapshot =>{
      this.publicNote = citySnapshot.publicNote   
    }).unsubscribe
  }

  showBasicNote(basicNoteId){
    this.newBasicInput = true;
    this.db.object(`basicNotes/${this.tripId}/${this.userId}/${basicNoteId}`)
    .subscribe(basicNotesSnapshot =>{       
         this.title = basicNotesSnapshot.title
         this.basicNote =  basicNotesSnapshot.note 
         this.basicNoteId = basicNotesSnapshot.$key      
    }).unsubscribe


  }




  publicOn(){
  	this.publicNotes = true;
    this.personalNotes = false;
  }
  personalOn(){
  	this.publicNotes = false;
    this.personalNotes = true;
  }

// Save btn

  savePublic(publicNotes: string){
    this.db.object(`tripDetails/${this.tripDetailId}`)
      .update({
        "publicNote": publicNotes
      })
  }

  savePersonal(personalNotes: string){
  	const userId = this.afAuth.currentUserId;
	  this.db.object(`tripDetails/${this.tripDetailId}/personalNotes`)
      .update({
  	      [userId]: personalNotes
  	  })  	   
  }

  saveBasic(title: string, note: string){
    this.db.list(`basicNotes/${this.tripId}/${this.userId}`)
      .push({
          "title": title,
          "note": note
     }) 
  }

  updateBasic(basicNoteId, title: string, note: string){
    this.db.object(`basicNotes/${this.tripId}/${this.userId}/${basicNoteId}`)
      .update({
          "title": title,
          "note": note
      })       
  }
}
