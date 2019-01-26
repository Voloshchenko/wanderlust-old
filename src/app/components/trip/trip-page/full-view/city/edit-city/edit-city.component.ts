// can't get data range into the view
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalSupportService} from '../../../../../../services/modal-support.service';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
declare var google: any;
@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {
  editCityForm: FormGroup;
// Keys for database
  tripId
  cityId  

// trip info
  tripStarts
  tripEnds
// city info
  cityName
  range
  countryName
  countryShortName 
  daysInCity


  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService) {}
  
  private buildForm() {
    this.editCityForm = this.fb.group({
      cityName:    ['', Validators.required ],
      range:    [null, Validators.required ],
      with: ''   
    });
  }

  myDateRangePickerOptions: IMyDrpOptions = {
    showClearBtn: false,
    showApplyBtn: false,
    inline: false,
    editableDateRangeField: false,
    openSelectorOnInputClick: true,
    dateFormat: 'dd.mm.yyyy',
    showSelectDateText: true,
  };

// Google search
  searchCompleted
  cityInput
  cityNames = []

  initializeSearch(){
    this.cityInput = document.getElementById('city')
    var options = {
      types: ['geocode'],
    }
    this.searchCompleted= new google.maps.places.Autocomplete(this.cityInput, options);
  }

  searchCity(){   
    this.searchCompleted.addListener('places_changed', this.fillInCity())   
  }

  fillInCity() {
    setTimeout(() => {
      var place = this.searchCompleted.getPlace();
      this.cityName = place.address_components[0].long_name;
      this.countryName = place.address_components[place.address_components.length-1].long_name;
      this.countryShortName = place.address_components[place.address_components.length-1].short_name;          
    }, 1000);
  }

  ngOnInit() {
    this.tripId = this.modalSupport.tripId;
    this.cityId = this.modalSupport.cityId;
    // check trip dates 
    this.db.object(`trips/${this.tripId}`).subscribe(tripSnapshot => { 
      this.tripStarts = tripSnapshot.range.beginDate
      this.tripStarts.day -= 1 
      this.tripEnds = tripSnapshot.range.endDate
      this.tripEnds.day += 1  
    }).unsubscribe() 
    this.myDateRangePickerOptions.disableUntil = this.tripStarts
    this.myDateRangePickerOptions.disableSince = this.tripEnds;
    
    // for autocomplete in edit form
	  this.db.object(`tripDetails/${this.cityId}`).subscribe(citySnapshot => {
      this.cityName = citySnapshot.cityName   
      this.countryName = citySnapshot.countryName
      this.countryShortName = citySnapshot.countryShortName 
      this.range = citySnapshot.range
    }).unsubscribe()
  	this.buildForm()
  }

// if you don't open calendar and choose dates all over again - mistake
  saveCity(){
	if (this.editCityForm.status != 'VALID') {
	      console.log('form is not valid, cannot save to database')
	      return
	} 
	const data = this.editCityForm.value
  // const firstDay = new Date(data.range.endJsDate)
  // const lastDay = new Date(data.range.beginJsDate)
  // this.daysInCity  = firstDay.getDate() - lastDay.getDate() + 1
  // console.log(this.daysInCity)
	const newDetails = this.db.object(`tripDetails/${this.cityId}`)
	newDetails.update({
		"cityName":this.cityName,
    "countryName":this.countryName,
    "countryShortName":this.countryShortName,    
    "range":data.range        																        
	})

	this.bsModalRef.hide()
  }
}
