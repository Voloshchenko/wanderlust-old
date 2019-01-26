import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {ManipulationService} from '../../../../../../../services/manipulation.service';
import {ModalSupportService} from '../../../../../../../services/modal-support.service';
import {AuthService} from '../../../../../../../services/authorization.service';

@Component({
  selector: 'accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent implements OnInit {
  @Input() accommodationId
  @Input() tripId 
  @Input() cityId 
  @Input() tripDetailId
  @ViewChild(ModalDirective) public modal: ModalDirective;
  
  subscription

  typeOfAccommodation
  hotelName
  hotelAddress
  starts
  ends
  checkIn
  checkOut
  booked
  paid
  cost
  latitude
  longitude
  currency
  
  constructor(public manipulate:ManipulationService,
              private db: AngularFireDatabase,
              public modalSupport: ModalSupportService,
              public afAuth: AuthService) { }

  ngOnInit() {
    this.subscription = this.db.object(`accommodation/${this.accommodationId}`).subscribe(citySnapshot => {
      this.typeOfAccommodation = citySnapshot.typeOfAccommodation
      this.hotelName = citySnapshot.hotelName
      this.hotelAddress = citySnapshot.hotelAddress
      this.starts = citySnapshot.range.beginJsDate
      this.ends = citySnapshot.range.endJsDate
      this.checkIn = citySnapshot.checkIn
      this.checkOut = citySnapshot.checkOut
      this.booked = citySnapshot.booked
      this.latitude = citySnapshot.latitude
      this.longitude = citySnapshot.longitude
    })
    this.db.object(`budget/${this.afAuth.currentUserId}/${this.tripId}/${this.accommodationId}`).subscribe(budgetSnapshot => {
      this.cost = budgetSnapshot.cost
      this.paid = budgetSnapshot.paid           
    })
    this.db.object(`trips/${this.tripId}`).subscribe(tripSnapshot => {
      this.currency = tripSnapshot.currency         
    })      
  }

  public showModal() {
    this.modal.show();
  }  
// delete trip - cant delete tripDetails in trip
  delete(){
    this.db.list('accommodation').remove(this.accommodationId)
    this.db.list(`tripDetails/${this.tripDetailId}/accommodation`).remove(this.accommodationId)
    this.db.list(`budget/${this.afAuth.currentUserId}/${this.tripId}`).remove(this.accommodationId)
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
