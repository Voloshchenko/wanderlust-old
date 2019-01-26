import { Injectable } from '@angular/core';
import { AuthService} from './authorization.service';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class BudgetService {

  constructor(public afAuth: AuthService,
  	          private db: AngularFireDatabase) { }


  updateBudget(data, tripId, tripDetailId, accommodationKey){  	
    const userId = this.afAuth.currentUserId;
	this.db.object(`budget/${userId}/${tripId}/${accommodationKey}`)
	        .update({
	        	'cost': data.cost,
	        	'paid': data.paid,
	        	'type': data.type
	        })	
	if(data.type == "transport"){
			this.db.object(`budget/${userId}/${tripId}/${accommodationKey}`)
		        .update({
		        	'name': data.fromCity + "-" + data.toCity 
		        })
	}
	if(data.type == "accommodation"){
			this.db.object(`budget/${userId}/${tripId}/${accommodationKey}`)
		        .update({
		        	'name': data.hotelName,
		        	'typeOfAccommodation':data.typeOfAccommodation
		        })
	}

  }


}
