import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalSupportService} from '../../../../services/modal-support.service';
import {TripFunctionsService} from '../../../../services/trip-functions.service';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
declare var google: any;

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  newCityForm: FormGroup;
  tripId 

  beginDate
  endDate
  defaultMonth 
  cityName 
  cityNames = []

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService,
              private tripFunct:TripFunctionsService
              ) { }

  private buildForm() {
    this.newCityForm = this.fb.group({
      cityName:    ['', Validators.required ],
      range:    [null, Validators.required ],
      with: ''
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
  
// Google search
  searchCompleted
  cityInput

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
      this.cityNames.splice(0, 1, 
        {cityName: place.address_components[0].long_name,
         countryName:place.address_components[place.address_components.length-1].long_name,
         countryShortName:place.address_components[place.address_components.length-1].short_name,         
        })

    }, 1000);
  }

  ngOnInit() {
    this.tripId = this.modalSupport.tripId
    this.db.object(`trips/${this.tripId}`).subscribe(tripSnapshot => {
      tripSnapshot.range.endDate.day = tripSnapshot.range.endDate.day
      this.beginDate = tripSnapshot.range.beginDate;
      this.endDate = tripSnapshot.range.endDate;
      this.defaultMonth = tripSnapshot.range.formatted.slice(3, 10)                     
    }).unsubscribe()
    this.myDateRangePickerOptions.disableUntil = this.beginDate
    this.myDateRangePickerOptions.disableSince = this.endDate;
  	this.buildForm()
  }


 saveNewCity(){
    if (this.newCityForm.status != 'VALID') {
      console.log('form is not valid, cannot save to database')
      return
    } 
    const data = this.newCityForm.value
    this.tripFunct.addCity(data, this.tripId, this.cityNames[0])
    this.bsModalRef.hide()
  }
}




















//     const cityKey = this.db.list('/tripDetails')
//            .push({"type": 'city', "cityName":data.cityName}).key
//     this.db.object(`tripDetails/${cityKey}`)
//                   .update({"starts":new Date(data.range[0]+60), "ends":data.range[1] })
//     this.db.object(`trips/${this.tripId}/tripDetails`).update({[cityKey]:true })
    
// // City is the start of the trip corrects the trip dates creates the flight to the city 
//     if(new Date(this.tripStarts)>data.range[0]){
//       this.db.object(`trips/${this.tripId}`).update({"tripStarts":data.range[0]})
//       const transportKey = this.db.list('/tripDetails').push({
//         "fromCity": "Moscow", 
//         "toCity": data.cityName,
//         "type": "transport"
//       }).key
//       this.db.object(`tripDetails/${transportKey}`)
//                       .update({
//                           "starts":new Date(data.range[0]-1), 
//                           "ends":data.range[0] 
//                       })

//       this.db.object(`trips/${this.tripId}/tripDetails`).update({[transportKey]:true })

// // City is the end of the trip corrects the trip dates creates the flight to  home 
//     } else if(new Date(this.tripEnds)<data.range[1]){
//       this.db.object(`trips/${this.tripId}`).update({"tripEnds":data.range[1]})
//       const transportKey = this.db.list('/tripDetails').push({
//         "fromCity": data.cityName, 
//         "toCity": "Moscow",
//         "type": "transport" 
//       }).key
//       this.db.object(`tripDetails/${transportKey}`)
//                       .update({
//                           "starts":data.range[1], 
//                           "ends":data.range[1] 
//                       })
//       this.db.object(`trips/${this.tripId}/tripDetails`).update({[transportKey]:true })
//     }  