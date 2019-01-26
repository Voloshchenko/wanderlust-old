import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {TripFunctionsService} from '../../../../../../../services/trip-functions.service'
import {ModalSupportService} from '../../../../../../../services/modal-support.service';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import {BudgetService} from '../../../../../../../services/budget.service';
declare var google: any;
import {AuthService} from '../../../../../../../services/authorization.service';

@Component({
  selector: 'edit-accommodation',
  templateUrl: './edit-accommodation.component.html',
  styleUrls: ['./edit-accommodation.component.css']
})
export class EditAccommodationComponent implements OnInit {
  editAccommodationForm: FormGroup;
  tripDetailId

  accommodationId
  hotelName
  hotelAddress
  cost
  booked
  paid
  typeOfAccommodation
  range
  checkIn
  checkOut  
  defaultMonth
  cityStarts
  cityEnds
  tripId
  name
  phone
  internationalPhone
  website
  latitude
  longitude

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService, 
              public tripFunction: TripFunctionsService,
              public budget: BudgetService,
              public afAuth: AuthService) { }
  private buildForm() {
    this.editAccommodationForm = this.fb.group({
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
      this.hotelName = place.name
      this.hotelAddress = place.formatted_address
      this.phone = place.formatted_phone_number
      this.internationalPhone = place.international_phone_number
      this.website = place.website 
    }, 1000);
  } 

// Google search address
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
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();      
      this.hotelAddress = place.formatted_address
    }, 1000);
  } 

  ngOnInit(){ 
    this.tripId = this.modalSupport.tripId
    this.accommodationId =this.modalSupport.accommodationId;
    this.db.object(`accommodation/${this.accommodationId}`).subscribe(accommodationSnapshot => {
      this.hotelName = accommodationSnapshot.hotelName
      this.hotelAddress = accommodationSnapshot.hotelAddress
      this.booked = accommodationSnapshot.booked
      this.typeOfAccommodation = accommodationSnapshot.typeOfAccommodation
      this.range = accommodationSnapshot.range
      this.checkIn = accommodationSnapshot.checkInTime
      this.checkOut = accommodationSnapshot.checkOutTime     
      this.defaultMonth = accommodationSnapshot.range.formatted.slice(3, 10) 
      this.latitude = accommodationSnapshot.latitude;
      this.longitude = accommodationSnapshot.longitude;    
    }) .unsubscribe

    this.db.object(`budget/${this.afAuth.currentUserId}/${this.tripId}/${this.accommodationId}`).subscribe(budgetSnapshot => {
      this.cost = budgetSnapshot.cost
      this.paid = budgetSnapshot.paid           
    })

    this.tripDetailId = this.modalSupport.tripDetailId	
    this.db.object(`tripDetails/${this.tripDetailId}`).subscribe(citySnapshot => {
        this.cityStarts = citySnapshot.range.beginDate
        this.cityStarts.day -= 1 
        this.cityEnds = citySnapshot.range.endDate
        this.cityEnds.day += 1 
        this.countryShort = citySnapshot.countryShortName      
    }).unsubscribe()
    this.myDateRangePickerOptions.disableUntil = this.cityStarts
    this.myDateRangePickerOptions.disableSince = this.cityEnds;
  	this.buildForm()  	
  }

  saveAccommodation(){
    this.tripId = this.modalSupport.tripId
  if (this.editAccommodationForm.status != 'VALID') {
        console.log('form is not valid, cannot save to database')
        return
  } 
  const data = this.editAccommodationForm.value
  const checkIn = new Date((new Date(data.range.beginJsDate)+ '').slice(0, 16) + data.checkIn +(new Date(data.range.beginJsDate)+ '').slice(21))  
  const checkOut = new Date((new Date(data.range.endJsDate)+ '').slice(0, 16) + data.checkOut +(new Date(data.range.endJsDate)+ '').slice(21))
  this.db.object(`/accommodation/${this.accommodationId}`).update({
    "typeOfAccommodation":data.typeOfAccommodation,    
    "hotelName":data.hotelName,
    "hotelAddress":data.hotelAddress,
    "booked": data.booked,
    "range": data.range, 
    "checkInTime": data.checkIn,
    "checkOutTime": data.checkOut, 
    "latitude": this.latitude,
    "longitude": this.longitude  
  })
  this.db.object(`/accommodation/${this.accommodationId}`).update({
    "checkIn": checkIn,
    "checkOut": checkOut 
  })
  this.budget.updateBudget(data, this.tripId, '', this.accommodationId)
  this.bsModalRef.hide()
  }
}
