import { Component, OnInit, OnDestroy } from '@angular/core';

import {AuthService} from '../../services/authorization.service';
import {ManipulationService} from '../../services/manipulation.service';


import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: FirebaseObjectObservable<any>;
  tripsKey: Array<any>;
  trips: Array<any> = [];
  userId
  tripsKeyTrue = []
  userName
  menuOpen = false
  constructor(public manipulate:ManipulationService,
              public afAuth: AuthService,
              private db: AngularFireDatabase) {}

// fixed double count
  ngOnInit() {
    const today = new Date();
    this.userId = this.afAuth.currentUserId
    this.user = this.db.object(`/users/${this.afAuth.currentUserId}`);
    this.user.subscribe(user =>{
      this.userName = user.name
      if(user.trips){      
        this.tripsKey = Object.keys(user.trips);   
        this.tripsKey.forEach(key => { 
          if(user.trips[key] == true){
            let tripObservable = this.db.object(`/trips/${key}`);
            tripObservable.subscribe(trip => {
              if(new Date(trip.range.endJsDate)>=today){
                if(this.trips.length==0){
                  this.trips.push(trip);
                } else {
                  for(var i=0; i<this.trips.length; i++){
                    if (this.trips[i].$key == trip.$key) {
                      this.trips.splice(i, 1)
                    }                          
                  }
                  this.trips.push(trip);                
                }
                this.trips.sort(function(a, b){return (a.range.beginJsDate > b.range.beginJsDate) ? 1 :(( a.range.beginJsDate < b.range.beginJsDate)?-1:0)})           
              }  
            })            
          }
        })
      }
    })  
  } 
 // add unsubscribe 
ngOnDestroy(){

}

  openMenu(){
    this.menuOpen = !this.menuOpen
  }

  logout() {
    this.afAuth.signOut();
  }
}
