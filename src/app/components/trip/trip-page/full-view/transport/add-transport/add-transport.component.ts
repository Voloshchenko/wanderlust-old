import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {TripFunctionsService} from '../../../../../../services/trip-functions.service'
import {ModalSupportService} from '../../../../../../services/modal-support.service';
import {BudgetService} from '../../../../../../services/budget.service';

import {IMyDpOptions } from 'mydatepicker';
declare var google: any;
@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.css']
})
export class AddTransportComponent implements OnInit {
  addTransportForm: FormGroup;
  zeroStarts = '00:00'
  zeroEnds = '00:00'
  // Autocomplete
  detailsArray
  fromCity
  fromCountryShortName
  toCity
  toCountryShortName
  starts
  ends
  index

  fromPort=''
  toPort=''

  tripStarts 
  tripEnds 
  defaultMonth
  typeOfTransport = 'plane'
  tripDetailId
  tripId
  constructor(public bsModalRef: BsModalRef,
              public modalSupport: ModalSupportService,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase, 
              public tripFunction: TripFunctionsService,
              public budget: BudgetService) {

  }

  private buildForm() {
    this.addTransportForm = this.fb.group({
      carrier:'',
      flight: '',    	
      fromCity:    ['', Validators.required ],
      toCity:    ['', Validators.required ],      
      fromPort: '',
      toPort: '',
      starts:    ['', Validators.required ],
      startsTime:'',
      ends:    ['', Validators.required ],
      endsTime: '',
      typeOfTransport:'',
      cost: 0,
      booked: false,
      paid: false,
      type: "transport"    
    });
  }
   
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    alignSelectorRight: false
  };

  public myDatePickerOptionsRight: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    alignSelectorRight: true
  };

// Google search city
  searchCompleted
  input

  initializeSearch(){
    this.input = document.activeElement
    if(this.input.id == 'fromCity' || this.input.id == 'toCity'){
      var optionsCity = {
        types: ['(regions)']     
      }
       this.searchCompleted= new google.maps.places.Autocomplete(this.input, optionsCity);
    } else if(this.input.id == 'fromPort'){
      var options = {
        types: ['geocode'],
        componentRestrictions: {country: this.fromCountryShortName}
      }
      this.searchCompleted= new google.maps.places.Autocomplete(this.input, options);     
    } else if(this.input.id == 'toPort'){
      var options = {
        types: ['geocode'],
        componentRestrictions: {country: this.toCountryShortName}
      }
      this.searchCompleted= new google.maps.places.Autocomplete(this.input, options);     
    }
  }
  
  search(){    
    this.searchCompleted.addListener('places_changed', this.fillIn())   
  }

  fillIn() { 
    setTimeout(() => {
      var place = this.searchCompleted.getPlace();
      if(place!= undefined){
        if(this.input.id == 'fromCity'){
          this.fromCity = place.address_components[0].long_name;
          if(place.address_components[place.address_components.length-1].types[0] == 'country'){          
          this.fromCountryShortName = place.address_components[place.address_components.length-1].short_name; 
           } else {
            this.fromCountryShortName = place.address_components[place.address_components.length-2].short_name; 
          } 
        }else if (this.input.id == 'toCity'){
          this.toCity = place.address_components[0].long_name;
          if(place.address_components[place.address_components.length-1].types[0] == 'country'){          
          this.toCountryShortName = place.address_components[place.address_components.length-1].short_name; 
          console.log(place.address_components)
           } else {
            this.toCountryShortName = place.address_components[place.address_components.length-2].short_name; 
            console.log(place.address_components[place.address_components.length-1].types[0])
          }           
        }else if (this.input.id == 'fromPort'){
          this.fromPort = place.name;
        }else if (this.input.id == 'toPort'){
          this.toPort = place.name;
        }
      }
    }, 500);
  }

  ngOnInit() {
   this.buildForm()     
   this.toCountryShortName = 'rus'
   this.tripId = this.modalSupport.tripId   
   this.db.object(`trips/${this.tripId}`).subscribe(tripSnapshot => {
      this.tripStarts = tripSnapshot.range.beginDate
      this.tripStarts.day -= 1
      this.tripEnds = tripSnapshot.range.endDate
      this.tripEnds.day += 1      
      this.defaultMonth = tripSnapshot.range.formatted.slice(3, 10)      
    }).unsubscribe()
    this.myDatePickerOptions.disableUntil = this.tripStarts
    this.myDatePickerOptions.disableSince = this.tripEnds;
    this.myDatePickerOptionsRight.disableUntil = this.tripStarts
    this.myDatePickerOptionsRight.disableSince = this.tripEnds;    
    this.detailsArray = this.tripFunction.tripDetails;
    this.index = this.modalSupport.index
    
    if(this.index == 0){      
      if(this.detailsArray[0].type == 'city'){    
      this.fromCity = 'Moscow';
      this.fromCountryShortName = 'rus'
      this.toCity = this.detailsArray[0].cityName   
      this.toCountryShortName = this.detailsArray[0].countryShortName              
      this.starts = {date: this.detailsArray[0].range.beginDate, jsdate: this.detailsArray[0].range.beginJsDate}
      this.ends = {date: this.detailsArray[0].range.beginDate, jsdate: this.detailsArray[0].range.beginJsDate}
      }
      if(this.detailsArray[0].type == 'transport'){    
      this.fromCity = 'Moscow';
      this.fromCountryShortName = 'rus'
      this.toPort = this.detailsArray[this.index].fromPort;
      this.toCity = this.detailsArray[0].fromCity   
      this.toCountryShortName = this.detailsArray[0].countryShortName              
      this.starts = {date: this.detailsArray[0].ends.date, jsdate: this.detailsArray[0].range.beginJsDate}
      this.ends = {date: this.detailsArray[0].ends.date, jsdate: this.detailsArray[0].range.beginJsDate}
      }      
    } else if (this.index == 'last'){
      if(this.detailsArray[this.detailsArray.length-1].type == 'city'){
        this.fromCity = this.detailsArray[this.detailsArray.length-1].cityName;
        this.fromCountryShortName = this.detailsArray[this.detailsArray.length-1].countryShortName
        this.toCity = 'Moscow'          
        this.starts = {date: this.detailsArray[this.detailsArray.length-1].range.endDate, jsdate: this.detailsArray[this.detailsArray.length-1].range.endJsDate}
        this.ends = {date: this.detailsArray[this.detailsArray.length-1].range.endDate, jsdate: this.detailsArray[this.detailsArray.length-1].range.endJsDate}            
      } else if(this.detailsArray[this.detailsArray.length-1].type == 'transport'){
        this.fromPort = this.detailsArray[this.detailsArray.length-1].toPort;
        this.fromCity = this.detailsArray[this.detailsArray.length-1].toCity;
        this.fromCountryShortName = this.detailsArray[this.detailsArray.length-1].toCountryShortName
        this.toCity = 'Moscow'        
        this.starts = {date: this.detailsArray[this.detailsArray.length-1].ends.date, jsdate: this.detailsArray[this.detailsArray.length-1].ends.jsdate}
        this.ends = {date: this.detailsArray[this.detailsArray.length-1].ends.date, jsdate: this.detailsArray[this.detailsArray.length-1].ends.jsdate}
      }           
    } else {
      if(this.detailsArray[this.index-1].type == 'city' && this.detailsArray[this.index].type == 'city'){
        this.fromCity = this.detailsArray[this.index-1].cityName;
        this.fromCountryShortName = this.detailsArray[this.index-1].countryShortName        
        this.toCity = this.detailsArray[this.index].cityName;
        this.toCountryShortName = this.detailsArray[this.index].countryShortName                
        this.starts = {date: this.detailsArray[this.index-1].range.endDate, jsdate: this.detailsArray[this.index-1].range.endJsDate}
        this.ends = {date: this.detailsArray[this.index-1].range.endDate, jsdate: this.detailsArray[this.index-1].range.endJsDate}
      } else if(this.detailsArray[this.index-1].type == 'transport' && this.detailsArray[this.index].type == 'city'){
        this.fromPort = this.detailsArray[this.index-1].toPort;
        this.fromCity = this.detailsArray[this.index-1].toCity;
        this.fromCountryShortName = this.detailsArray[this.index-1].toCountryShortName        
        this.toCity = this.detailsArray[this.index].cityName;
        this.toCountryShortName = this.detailsArray[this.index].countryShortName                
        this.starts = {date: this.detailsArray[this.index-1].ends.date, jsdate: this.detailsArray[this.index-1].range.endJsDate}
        this.ends = {date: this.detailsArray[this.index-1].ends.date, jsdate: this.detailsArray[this.index-1].range.endJsDate}
      } else if(this.detailsArray[this.index-1].type == 'city' && this.detailsArray[this.index].type == 'transport'){
        this.fromCity = this.detailsArray[this.index].cityName;
        this.fromCountryShortName = this.detailsArray[this.index].countryShortName 
        this.toPort = this.detailsArray[this.index-1].toPort;        
        this.toCity = this.detailsArray[this.index-1].toCity;
        this.toCountryShortName = this.detailsArray[this.index-1].toCountryShortName                       
        this.starts = {date: this.detailsArray[this.index-1].range.endDate, jsdate: this.detailsArray[this.index-1].range.endJsDate}
        this.ends = {date: this.detailsArray[this.index-1].range.endDate, jsdate: this.detailsArray[this.index-1].range.endJsDate}
      } else if(this.detailsArray[this.index-1].type == 'transport' && this.detailsArray[this.index].type == 'transport'){
        this.fromPort = this.detailsArray[this.index-1].fromPort;
        this.fromCity = this.detailsArray[this.index].fromCity;
        this.fromCountryShortName = this.detailsArray[this.index].fromCountryShortName
        this.toPort = this.detailsArray[this.index-1].toPort;         
        this.toCity = this.detailsArray[this.index-1].toCity;
        this.toCountryShortName = this.detailsArray[this.index-1].toCountryShortName                       
        this.starts = {date: this.detailsArray[this.index-1].ends.date, jsdate: this.detailsArray[this.index-1].range.endJsDate}
        this.ends = {date: this.detailsArray[this.index-1].ends.date, jsdate: this.detailsArray[this.index-1].range.endJsDate}
      }
    }
  }


  saveTransport(){
  	if (this.addTransportForm.status != 'VALID') {
  	      console.log('form is not valid, cannot save to database')
  	      return
  	}
    this.tripId = this.modalSupport.tripId 
    this.detailsArray = this.tripFunction.tripDetails;
    this.index = this.modalSupport.index

    const data = this.addTransportForm.value

    const transportKey = this.db.list('/tripDetails').push({
  		"carrier":data.carrier,
  		"flight":data.flight,
  		"fromCity":data.fromCity,
      "fromCountryShortName":this.fromCountryShortName,
  		"toCity":data.toCity,
      "toCountryShortName":this.toCountryShortName,
  		"fromPort":data.fromPort, 
      "toPort":data.toPort,
  		"startsTime": data.startsTime,
  	  "endsTime": data.endsTime,		
  	  "typeOfTransport":data.typeOfTransport,  
      "type": "transport",
      "booked": data.booked            													        
  	}).key
    this.db.object(`/tripDetails/${transportKey}`)
          .update({
              "starts":data.starts,
              "ends":data.ends
        })  
    const starts = new Date((new Date(data.starts.jsdate)+ '').slice(0, 16) + data.startsTime +(new Date(data.starts.jsdate)+ '').slice(21));
    const ends = new Date((new Date(data.ends.jsdate)+ '').slice(0, 16) + data.endsTime +(new Date(data.ends.jsdate)+ '').slice(21))
      this.db.object(`/tripDetails/${transportKey}/range`)
          .update({
              "beginJsDate":starts,
              "endJsDate":ends
          })      
    this.db.object(`/trips/${this.tripId}/tripDetails`)
      .update({[transportKey]:true }) 
    this.budget.updateBudget(data, this.tripId, '', transportKey)    
  	this.bsModalRef.hide()
  }

}
