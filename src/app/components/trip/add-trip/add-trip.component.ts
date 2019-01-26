import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

import{City} from '../city-model';
import {TripFunctionsService} from '../../../services/trip-functions.service';
import {FindFriendsService} from '../../../services/find-friends.service';

import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import {Subject} from 'rxjs/Subject'

declare var google: any;

@Component({
  selector: 'add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  newTripForm: FormGroup;
//Add friends to the trip variables 
  members = []
  startsAt = new Subject()
  endAt = new Subject()
  users
  addedUser = {}
  output = false
// Range picker variable
  defaultMonth
  cityNames = []


  constructor(public bsModalRef: BsModalRef,
 	            private fb: FormBuilder,
              private router: Router,
              private tripFunct:TripFunctionsService,
              public findFriends: FindFriendsService ) { }

// Form builder
  private buildForm() {
    this.newTripForm = this.fb.group({ 
      tripName: ['', Validators.required ],
      cities: this.fb.array([]),
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


// choose trip dates, restricts the date picker for cities  
  onDateRangeChanged(event:any) {
    event.beginDate.day = event.beginDate.day-1
    event.endDate.day = event.endDate.day+1
    this.myDateRangePickerOptions.disableUntil = event.beginDate
    this.myDateRangePickerOptions.disableSince = event.endDate;
    this.defaultMonth = event.formatted.slice(3, 10)
    this.addCity()   
  }

// Add new city input
  get cities(): FormArray {
    return this.newTripForm.get('cities') as FormArray;
  };

  addCity() {
    this.cities.push(this.fb.group(new City())); 
  }
  
  remove(i){
    this.cities.removeAt(i)
  }
// Google search
  searchCompleted
  cityInput

  initializeSearch(i){
    this.cityInput = document.getElementById('city'+i)
    var options = {
      types: ['geocode'],
    }
    this.searchCompleted= new google.maps.places.Autocomplete(this.cityInput, options);
  }

  searchCity(i){   
    this.searchCompleted.addListener('places_changed', this.fillInCity(i))   
  }

  fillInCity(i) {
    setTimeout(() => {
      var place = this.searchCompleted.getPlace();
      this.cityNames.splice(i, 1, 
        {cityName: place.address_components[0].long_name,
         countryName:place.address_components[place.address_components.length-1].long_name,
         countryShortName:place.address_components[place.address_components.length-1].short_name,         
        })
    }, 1000);
  }

  ngOnInit() {
    this.buildForm()
    this.findFriends.getUsers(this.startsAt, this.endAt).subscribe(users=>this.users = users)    
  }

// Look for friends in the form
  search($event){
    this.output = true
    let q = $event.target.value
    this.startsAt.next(q)
    this.endAt.next(q+"\uf8ff")
  }

  inviteFriendsToTrip(userId, name){
    this.output = false
    this.addedUser = {"userName": name, "userId":userId }
    this.members.push( this.addedUser)
  }
  // inviteFriendsToCity(userId, name, i){
  //   console.log(i)
  // }
  removeFriend(index) {
    this.members.splice(index, 1)
  }

  hideOutput(){
    this.output = false
  }
  saveNewTrip(){
  	if (this.newTripForm.status != 'VALID') {
      console.log(Error)
      return Error
    } 
    const data = this.newTripForm.value
    this.tripFunct.createNewTrip(data, this.members, this.cityNames)
    this.bsModalRef.hide()
    this.router.navigate(["trip/"+this.tripFunct.tripKey]);
  }

}
