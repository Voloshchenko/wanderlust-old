import { Component, OnChanges, Input, SimpleChange, HostListener } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {AuthService} from '../../../../services/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as _ from 'lodash'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnChanges {
  trip; 
  @Input() tripId: string;
  // items: FirebaseListObservable<any>;
  name: any;
  msgVal: string = '';
  members
  userName
  userId
  openDialog = false;
  items 
  batch = 20         // size of each query
  lastKey = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached
  currentMsg
  chatLength

  constructor(public db: AngularFireDatabase,
              public afAuth: AuthService,
  	          private route: ActivatedRoute) {}

getMessages() {
    let query =  {
            orderByKey: true,
            limitToLast: this.batch,
          }
    // if (lastKey) query['endAt'] = lastKey
    return this.items = this.db.list(`/messages/${this.tripId}`, {
      query
    })
  }


  onScroll () {
    if(this.batch<this.chatLength){
    this.batch +=20
    this.getMessages() 
  } else {
    this.finished = true
   }
  }

  // private getMovies(key?) {
  //   if (this.finished) return
  //     this.getMessages(this.batch+1, this.lastKey)
  //       .do(movies => {
  //   //       /// set the lastKey in preparation for next query

  //         this.lastKey = _.first(movies)['$key']
  //         const newMovies = _.slice(movies, 1, this.batch+1)


  //   //       /// Get current movies in BehaviorSubject
  //         this.currentMsg = this.items.getValue()
  //   //       /// If data is identical, stop making queries
  //   // console.log(_.first(newMovies)['$key'])
  //         // if (this.lastKey == _.first(newMovies)['$key']) {
  //         //   this.finished = true
  //         // }
  //   //       /// Concatenate new movies to current movies
  //         this.items.next( _.concat( newMovies, this.currentMsg) )
  //       })
  //       .take(1)
  //       .subscribe()
  // }


chatSend(theirMessage: string) {
      this.db.list(`/messages/${this.tripId}`).push({ message: theirMessage, name: this.userName, userId: this.userId});
      this.msgVal = '';
  }

toggleChat(){
  this.openDialog = !this.openDialog
}

  ngOnChanges (changes: {[propKey: string] : SimpleChange}) {
    
  	this.userId = this.afAuth.currentUserId
  	this.db.object(`/users/${this.userId}`).subscribe(user =>{
      this.userName = user.name     
     })
  	   
  	this.route.params.subscribe(params=>{this.trip = this.db.object('/trips/'+params['tripName'])          
       return this.tripId = params['tripName']
 	})
   // this.getMovies() 
   this.getMessages()
   this.db.list(`/messages/${this.tripId}`)
   .map(list=>list.length)
   .subscribe(length=>this.chatLength = length)
  }


}
