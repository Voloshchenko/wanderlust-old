import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnChanges{
 @Input() userId
 @Input() tripId 
 total: number;
 toPay: number;
 paid: number;
 trip
 currency

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute) { }

  ngOnChanges (changes: {[propKey: string] : SimpleChange}) {
    this.db.list(`budget/${this.userId}/${this.tripId}/`)
        .subscribe(budgetSnapShot=>{
          this.total = 0
          this.paid = 0
          this.toPay = 0 
          for(var i=0; i<budgetSnapShot.length; i++){            
            if(budgetSnapShot[i].paid == true){
              this.paid += budgetSnapShot[i].cost
            } else {
              this.toPay += budgetSnapShot[i].cost
            }
          }
          this.total = (+this.paid) + ( +this.toPay )
        })  
      this.db.object(`trips/${this.tripId}`)
        .subscribe(tripSnapShot=>{
          this.currency = tripSnapShot.currency
        })           
    }

     

}
