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

@Component({
  selector: 'app-trip-settings',
  templateUrl: './trip-settings.component.html',
  styleUrls: ['./trip-settings.component.css']
})
export class TripSettingsComponent implements OnInit {
  newTripForm: FormGroup;
  tripId
  tripName
  range
  currency

  constructor(public bsModalRef: BsModalRef,
 	            private fb: FormBuilder,
              private db: AngularFireDatabase,
              private tripFunct:TripFunctionsService,
              public modalSupport: ModalSupportService,
              private router: Router,
              public afAuth: AuthService) { }
// Form builder
  private buildForm() {
    this.newTripForm = this.fb.group({ 
      tripName: ['', Validators.required ],
      range: ['', Validators.required ],
      currency:['', Validators.required ]
    });
  }

// format for date range picker
  myDateRangePickerOptions: IMyDrpOptions = {
    showClearBtn: false,
    showApplyBtn: false,
    inline: false,
    editableDateRangeField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'dd.mm.yyyy',
    showSelectDateText: true,
  };

  ngOnInit() {
  	this.tripId = this.modalSupport.tripId
    this.buildForm()
    this.db.object(`trips/${this.tripId}`).subscribe(tripSnapshot => {
      this.tripName = tripSnapshot.tripName
      this.range = tripSnapshot.range 
      this.currency = tripSnapshot.currency
    }).unsubscribe()
  }
  saveNewTrip(){
  if (this.newTripForm.status != 'VALID') {
        console.log('form is not valid, cannot save to database')
        return
  } 
  const data = this.newTripForm.value
  const newTrip = this.db.object(`trips/${this.tripId}`)
  newTrip.update({
    "tripName":data.tripName,   
    "range":data.range, 
    "currency" : data.currency                                              
  })
  this.bsModalRef.hide()
  }

  delete(){
     this.db.object(`trips/${this.tripId}`).subscribe(items=>{           
       if(Object.keys(items.members).length == 1){
          this.db.list('trips/').remove(this.tripId);
          this.db.list(`users/${this.afAuth.currentUserId}/trips`).remove(this.tripId)
          this.db.list(`budget/${this.afAuth.currentUserId}`).remove(this.tripId)
          var tripDetailsArr = Object.keys(items.tripDetails)
          for (var i = 0; i< tripDetailsArr.length ; i++) {
            this.db.list(`tripDetails`).remove(tripDetailsArr[i])                 
          }  
       }else if(Object.keys(items.members).length > 1){
         this.db.list(`users/${this.afAuth.currentUserId}/trips`).remove(this.tripId)
         this.db.list(`trips/${this.tripId}/members`).remove(this.afAuth.currentUserId)
         this.db.list(`budget/${this.afAuth.currentUserId}`).remove(this.tripId) 
       }
     }).unsubscribe()
    this.router.navigate(['/user']);    
  }
}
