import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {TripFunctionsService} from '../../../../../../../services/trip-functions.service'
import {ModalSupportService} from '../../../../../../../services/modal-support.service';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import {BudgetService} from '../../../../../../../services/budget.service';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat = this.modalSupport.latitude;
  lng = this.modalSupport.longitude;
  zoom

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService, 
              public tripFunction: TripFunctionsService,
              public budget: BudgetService) { }

  ngOnInit() {
   this.zoom = 15;

  }

}
