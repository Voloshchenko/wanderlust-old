import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalSupportService} from '../../../../../../../services/modal-support.service';
import {BudgetService} from '../../../../../../../services/budget.service';

import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
declare var google: any;

@Component({
  selector: 'add-accommodation',
  templateUrl: './add-accommodation.component.html',
  styleUrls: ['./add-accommodation.component.css']
})
export class AddAccommodationComponent implements OnInit {
  addAccommodationForm: FormGroup;
  cityId
  tripId

  zeroStarts = '00:00'
  zeroEnds = '00:00'

  range
  cityStarts
  cityEnds
  defaultMonth

  name
  address
  phone
  internationalPhone
  website
  typeOfAccommodation = 'hotel'
  latitude
  longitude

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService,
              public budget: BudgetService ) { 
  }

  private buildForm() {
    this.addAccommodationForm = this.fb.group({
      hotelName:    ['', Validators.required ],
      hotelAddress:    ['', Validators.required ],
      range:    [null, Validators.required ],
      checkIn: '',
      checkOut:'',
      cost:'',
      booked:false,
      paid:false,
      typeOfAccommodation:    ['', Validators.required ],
      type: "accommodation"  
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


// Google search hotel
  searchCompleted
  cityInput
  cityNames
  countryShort
  initializeSearch(){
    this.cityInput = document.getElementById('hotel')
    var options = {
      types: ['establishment'], 
      componentRestrictions: {country: this.countryShort}
    }
    this.searchCompleted= new google.maps.places.Autocomplete(this.cityInput, options);
  }

  searchHotel(){   
    this.searchCompleted.addListener('places_changed', this.fillInCity())   
  }



  fillInCity() {
    setTimeout(() => {
      var place = this.searchCompleted.getPlace();
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.name = place.name
      this.address = place.formatted_address
      this.phone = place.formatted_phone_number
      this.internationalPhone = place.international_phone_number
      this.website = place.website 
    }, 1000);
  } 

// Google search hotel
   initializeSearchAddress(){
    this.cityInput = document.getElementById('address')
    var options = {
      types: ['address'], 
      componentRestrictions: {country: this.countryShort}
    }
    this.searchCompleted= new google.maps.places.Autocomplete(this.cityInput, options);
  }

  searchAddress(){   
    this.searchCompleted.addListener('places_changed', this.fillInAddress())   
  } 

  fillInAddress() {
    setTimeout(() => {
      var place = this.searchCompleted.getPlace();
      this.address = place.formatted_address
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    }, 1000);
  } 

  ngOnInit() {   
    this.tripId = this.modalSupport.tripId
    this.cityId = this.modalSupport.cityId;
        // for autocomplete in edit form
    this.db.object(`tripDetails/${this.cityId}`).subscribe(citySnapshot => {
        this.cityStarts = citySnapshot.range.beginDate
        this.cityStarts.day -= 1 
        this.cityEnds = citySnapshot.range.endDate
        this.cityEnds.day += 1 
        this.countryShort = citySnapshot.countryShortName      
    }).unsubscribe()
    

    this.myDateRangePickerOptions.disableUntil = this.cityStarts
    this.myDateRangePickerOptions.disableSince = this.cityEnds;

    this.db.object(`tripDetails/${this.cityId}`).subscribe(citySnapshot => {     
        this.range = citySnapshot.range;   
        this.defaultMonth = citySnapshot.range.formatted.slice(3, 10) 
    }).unsubscribe()

  
  	this.buildForm()
  }


  saveAccommodation(){
  if (this.addAccommodationForm.status != 'VALID') {
        console.log('form is not valid, cannot save to database')
        return
  } 
  const data = this.addAccommodationForm.value
  const checkIn = new Date((new Date(data.range.beginJsDate)+ '').slice(0, 16) + data.checkIn +(new Date(data.range.beginJsDate)+ '').slice(21))  
  const checkOut = new Date((new Date(data.range.endJsDate)+ '').slice(0, 16) + data.checkOut +(new Date(data.range.endJsDate)+ '').slice(21))
  const accommodationKey = this.db.list('/accommodation').push({
    "typeOfAccommodation":data.typeOfAccommodation,    
    "hotelName":data.hotelName,
    "hotelAddress":data.hotelAddress,
    "booked": data.booked,
    "range": data.range, 
    "checkInTime": data.checkIn,
    "checkOutTime": data.checkOut,
    "type": data.type, 
    "latitude": this.latitude,
    "longitude": this.longitude 

  }).key
  this.db.object(`/accommodation/${accommodationKey}`).update({
    "checkIn": checkIn,
    "checkOut": checkOut 
  })
  this.db.object(`tripDetails/${this.cityId}/accommodation`).update({
    [accommodationKey]: true
  })
  this.budget.updateBudget(data, this.tripId, this.cityId, accommodationKey)
  this.bsModalRef.hide()
  }
}
