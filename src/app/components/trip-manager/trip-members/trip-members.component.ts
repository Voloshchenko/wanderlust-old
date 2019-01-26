import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from '../../../services/authorization.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


@Component({
  selector: 'trip-members',
  templateUrl: './trip-members.component.html',
  styleUrls: ['./trip-members.component.css']
})
export class TripMembersComponent implements OnInit {
@Input() members
userId
with = []

  constructor(public afAuth: AuthService,
              private db: AngularFireDatabase) { }

  ngOnInit() {
  	this.userId = this.afAuth.currentUserId 
  	const membersKey = Object.keys(this.members)
 	membersKey.forEach(keyMember => {               
      if(this.members[keyMember] == true && keyMember !=this.userId){ 
            let userObservable = this.db.object(`/users/${keyMember}`);
              userObservable.subscribe(userId => {
                 this.with.push({"id":keyMember, "name": userId.name})	     
            })          	                    
      }
    })

  }

}
