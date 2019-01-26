import { Component, OnChanges, Input, SimpleChange } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {TripFunctionsService} from '../../../../services/trip-functions.service'
import {ManipulationService} from '../../../../services/manipulation.service';
import {ModalSupportService} from '../../../../services/modal-support.service';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnChanges {
	@Input() tripId: string;
	trip: FirebaseObjectObservable<any>;
	tripDetailsKey: Array<any>;
	tripDetails

  constructor(public manipulate:ManipulationService,
              public modalSupport: ModalSupportService,
              private db: AngularFireDatabase, 
              public tripFunction: TripFunctionsService) { }
  ngOnChanges (changes: {[propKey: string] : SimpleChange}) {
// make array empty after switching to another trip    
    this.tripFunction.tripDetails =  []
    this.tripDetails = this.tripFunction.tripDetails
    this.db.object(`trips/${this.tripId}/tripDetails`).subscribe(trip =>{     
    setTimeout(this.tripFunction.showTripInfo(this.tripId)
      , 20)
      
    })                     
  }

}
