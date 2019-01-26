import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import {AuthService} from '../../../../../services/authorization.service';
import {ManipulationService} from '../../../../../services/manipulation.service';
import {ModalSupportService} from '../../../../../services/modal-support.service';
import {TripFunctionsService} from '../../../../../services/trip-functions.service'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {
  @Input()transportId:string;
  @Input() tripId: string;
  @Input() index: number;
  @ViewChild(ModalDirective) public modal: ModalDirective;

// variables for teamplate
changed
type
typeOfTransport
fromCity
fromPort
starts
startsTime
toCity
toPort
ends
endsTime
carrier
flight
booked
cost
paid
currency
  
  constructor(public manipulate:ManipulationService,
              private db: AngularFireDatabase,
              public modalSupport: ModalSupportService,
              public tripFunction: TripFunctionsService,
              public afAuth: AuthService) { }

  ngOnInit() {
    this.db.object(`tripDetails/${this.transportId}`).subscribe(transportSnapshot => {
      this.changed = transportSnapshot.changed
      this.type = transportSnapshot.type
      this.typeOfTransport = transportSnapshot.typeOfTransport
      this.fromCity = transportSnapshot.fromCity
      this.fromPort = transportSnapshot.fromPort
      this.starts = transportSnapshot.range.beginJsDate
      this.startsTime = transportSnapshot.startsTime
      this.toCity = transportSnapshot.toCity
      this.toPort = transportSnapshot.toPort
      this.ends = transportSnapshot.range.endJsDate
      this.endsTime = transportSnapshot.endsTime
      this.carrier = transportSnapshot.carrier
      this.flight = transportSnapshot.flight
      this.booked = transportSnapshot.booked
    })
    this.db.object(`budget/${this.afAuth.currentUserId}/${this.tripId}/${this.transportId}`).subscribe(budgetSnapshot => {
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
    this.db.list('tripDetails').remove(this.transportId)
    this.db.list(`trips/${this.tripId}/tripDetails`).remove(this.transportId)
    this.tripFunction.tripDetails.splice(this.index, 1)
    this.db.list(`budget/${this.afAuth.currentUserId}/${this.tripId}`).remove(this.transportId)
  }
}














