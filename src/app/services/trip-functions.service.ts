import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import {AuthService} from './authorization.service';

@Injectable()
export class TripFunctionsService {
  tripKey
min; max; datesStart; datesEnd


  constructor(private db: AngularFireDatabase, 
              public afAuth: AuthService,
              ) {}

// Add friends to the whole trip
  addFriendsToTrip(members, tripId){
    for(var i=0; i<members.length; i++){
  // Add user to the trip
        this.db.object(`/trips/${tripId}/members`).update({
          [members[i].userId]: true
        })
  // Add trip to the user
        this.db.object(`users/${members[i].userId}/trips`).update({[tripId]: false})     

     }     
  }


// Add city
addCity(data, tripId, cityNames){
  const cityKey = this.db.list('/tripDetails')
    .push({
        "type": 'city',
        "cityName": cityNames.cityName,
        "countryName":cityNames.countryName,
        "countryShortName":cityNames.countryShortName,         

      }).key
  this.db.object(`/tripDetails/${cityKey}`)
    .update({
            "range": data.range                     
    })
  this.db.object(`trips/${tripId}/tripDetails`)
    .update({
            [cityKey]:"city"
    })
}

// Add Transport
  addTransport(data, tripId){
    const transportKey = this.db.list('/tripDetails')
      .push({"type": 'transport',  
             "changed": false
      }).key

    this.db.object(`/tripDetails/${transportKey}/starts`)
      .update({
              "jsdate": data.beginJsDate, 
              "date":data.beginDate
      })

    this.db.object(`/tripDetails/${transportKey}/ends`)          
      .update({
              "jsdate": data.beginJsDate,
              "date":data.beginDate             
      })

    this.db.object(`trips/${tripId}/tripDetails`)
      .update({
              [transportKey]:"city"
      })      
  }


// Create new trip
  createNewTrip(data: any, members, cityNames) {
  // variables
    const userId = this.afAuth.currentUserId;

  // save general trip info
    this.tripKey = this.db.list('/trips')
      .push({
        "tripName": data.tripName,
        "currency": data.currency
      }).key
    this.db.object(`/trips/${this.tripKey}`)
      .update({"range": data.range})

    this.addFriendsToTrip(members, this.tripKey)              

  // save info about cities
    for(var i=0; i<data.cities.length; i++ ){
        this.addCity(data.cities[i], this.tripKey, cityNames[i]) 
    }

  // Add trip to the user that created the trip
    this.db.object(`users/${userId}/trips`).update({[this.tripKey]: true})
    this.db.object(`/trips/${this.tripKey}/members`).update({
          [userId]: true
      })
  }














tripDetails: Array<any> = [];
// Show Trip details
  showTripInfo(tripId){
    
    const trip = this.db.object(`/trips/${tripId}/`);
    trip.subscribe(trip =>{
      if(trip.tripDetails){
        const tripDetailsKey = Object.keys(trip.tripDetails);
        const arrayLength = tripDetailsKey.length
        tripDetailsKey.forEach(key => {            
          let tripObservable = this.db.object(`/tripDetails/${key}`);
          tripObservable.subscribe(tripDetail => {          
            if(this.tripDetails.length==0 && tripDetail.range !=undefined){
              this.tripDetails.push(tripDetail);                          
            } else if(tripDetail.range !=undefined) {
              this.tripDetails.push(tripDetail);                                                         
              for(var i=0; i<this.tripDetails.length; i++){
                for (var j=0; j<this.tripDetails.length; j++) {
                  if(j!=i && this.tripDetails[i].$key ==this.tripDetails[j].$key){
                         this.tripDetails.splice(j, 1)
                  }
                }
                if (this.tripDetails[i].$key == tripDetail.$key) {
                  this.tripDetails.splice(i, 1, tripDetail)
                }
              }
            }
            this.tripDetails.sort(function(a, b) {
              if (a.range.endJsDate < b.range.endJsDate){
                return -1;
              }
              if (a.range.endJsDate > b.range.endJsDate){
                return 1;
              } else {
                return 0
              }
            })
            // for one day cities order
            if(this.tripDetails.length==arrayLength){
              for(var i=0; i<arrayLength-1; i++){
                if(this.tripDetails[i].type == "city" && this.tripDetails[i+1].type == "transport"){  
                  if(this.tripDetails[i].cityName == this.tripDetails[i+1].toCity){
                    var temp = this.tripDetails[i]
                    this.tripDetails[i] = this.tripDetails[i+1]
                    this.tripDetails[i+1] = temp
                  }
                }                
              }              
            }  
         
          })
        })
      }
    return this.tripDetails      
    })       
  }
}

