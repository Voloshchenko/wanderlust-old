import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {ManipulationService} from '../../../../../services/manipulation.service';
import {ModalSupportService} from '../../../../../services/modal-support.service';
import {TripFunctionsService} from '../../../../../services/trip-functions.service'

@Component({
  selector: 'city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  @Input()tripDetailId:string;
  @Input() tripId: string;
  @Input() index: number;
  @ViewChild(ModalDirective) public modal: ModalDirective;

  cityId
    
  cityName
  beginJsDate
  endJsDate
  accommodations = []


  tripDetails
  public tripDetail = {};  
 
  constructor(public manipulate:ManipulationService,
              private db: AngularFireDatabase,
              public modalSupport: ModalSupportService,
              public tripFunction: TripFunctionsService) { }

  ngOnInit() {	
    this.tripDetails = this.db.object(`tripDetails/${this.tripDetailId}`)
  	this.tripDetails.subscribe(citySnapshot => {
      if(citySnapshot.accommodation){
        this.accommodations = Object.keys(citySnapshot.accommodation)
      };
      this.cityName = citySnapshot.cityName
      this.beginJsDate = citySnapshot.range.beginJsDate
      this.endJsDate = citySnapshot.range.endJsDate
      this.cityId = citySnapshot.$key

    })
  }

  public showModal() {
    this.modal.show();
  }  
// delete trip - cant delete tripDetails in trip
  delete(){
    this.db.list('tripDetails').remove(this.tripDetailId)
    this.db.list(`trips/${this.tripId}/tripDetails`).remove(this.tripDetailId)
    this.tripFunction.tripDetails.splice(this.index, 1)
  }
}
