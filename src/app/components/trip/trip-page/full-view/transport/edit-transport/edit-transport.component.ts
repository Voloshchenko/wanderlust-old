import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {TripFunctionsService} from '../../../../../../services/trip-functions.service'
import {IMyDpOptions} from 'mydatepicker';
import {ModalSupportService} from '../../../../../../services/modal-support.service';
import {BudgetService} from '../../../../../../services/budget.service';
declare var google: any;

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.css']
})
export class EditTransportComponent implements OnInit {
  editTransportForm: FormGroup;
  transportId
  index
  tripDetails

  carrier
  flight
  fromCity
  fromCountryShortName
  toCity
  toCountryShortName
  fromPort
  toPort
  startsTime
  endsTime
  typeOfTransport
  starts
  ends 
  cost
  paid
  booked

  strStart: string
  strEnd: string


  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService, 
              public tripFunction: TripFunctionsService,
              public budget: BudgetService) {}
  
  private buildForm() {
    this.editTransportForm = this.fb.group({
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
          this.fromCountryShortName = place.address_components[place.address_components.length-1].short_name;            
        }else if (this.input.id == 'toCity'){
          this.toCity = place.address_components[0].long_name;
          this.toCountryShortName = place.address_components[place.address_components.length-1].short_name;            
        }else if (this.input.id == 'fromPort'){
          this.fromPort = place.name;
        }else if (this.input.id == 'toPort'){
          this.toPort = place.name;
        }
      }
    }, 1000);
  }
  
  ngOnInit() {
    this.transportId =this.modalSupport.transportId;
    this.db.object(`budget/${this.modalSupport.userId}/${this.modalSupport.tripId}/${this.transportId}`).subscribe(budgetSnapshot => {
      this.cost = budgetSnapshot.cost
      this.paid = budgetSnapshot.paid           
    })

    this.db.object(`tripDetails/${this.transportId}`).subscribe(transportSnapshot => {
      this.carrier = transportSnapshot.carrier
      this.flight = transportSnapshot.flight
      this.fromCity = transportSnapshot.fromCity
      this.fromCountryShortName = transportSnapshot.fromCountryShortName
      this.toCity = transportSnapshot.toCity
      this.toCountryShortName = transportSnapshot.toCountryShortName   
      this.fromPort = transportSnapshot.fromPort
      this.toPort = transportSnapshot.toPort
      this.startsTime = transportSnapshot.startsTime                 
      this.endsTime = transportSnapshot.endsTime
      this.typeOfTransport = transportSnapshot.typeOfTransport
      this.starts = transportSnapshot.starts
      this.starts.jsdate = new Date(transportSnapshot.starts.jsdate)   
      this.ends = transportSnapshot.ends
      this.ends.jsdate = new Date(transportSnapshot.ends.jsdate)
      this.booked =  transportSnapshot.booked           
    })

  	this.buildForm()

  }

  saveTransport(){
    if (this.editTransportForm.status != 'VALID') {
          console.log('form is not valid, cannot save to database')
          return
    }     
    const data = this.editTransportForm.value
    const starts = new Date((data.starts.jsdate+ '').slice(0, 16) + data.startsTime +(data.starts.jsdate+ '').slice(21));
    const ends = new Date((data.ends.jsdate+ '').slice(0, 16) + data.endsTime +(data.ends.jsdate+ '').slice(21))
    this.index = this.modalSupport.index
    this.tripDetails =  this.tripFunction.tripDetails
 
	const newDetails = this.db.object(`tripDetails/${this.transportId}`)
	newDetails.update({
		"carrier":data.carrier,
		"flight":data.flight,
		"fromCity":data.fromCity,
    "fromCountryShortName":this.fromCountryShortName,
    "toCity":data.toCity,
    "toCountryShortName":this.toCountryShortName,
		"fromPort":data.fromPort,
    "toPort": data.toPort,
		"startsTime": data.startsTime,
    "endsTime": data.endsTime,
    "starts":data.starts,
    "ends":data.ends,		
    "typeOfTransport":data.typeOfTransport,
    "changed": true	,
    "booked": data.booked													        
	})
  this.db.object(`/tripDetails/${this.transportId}/range`)
    .update({
              "beginJsDate":starts,
              "endJsDate":ends
          })
  
  this.budget.updateBudget(data, this.modalSupport.tripId, '', this.transportId)
	this.bsModalRef.hide()
  }
}
