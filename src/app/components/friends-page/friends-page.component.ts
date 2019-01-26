import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/authorization.service';
import {FindFriendsService} from '../../services/find-friends.service';
import {ManipulationService} from '../../services/manipulation.service';
import {ModalSupportService} from '../../services/modal-support.service';
import {FriendsListService} from '../../services/friends-list.service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Subject} from 'rxjs/Subject'

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  startsAt = new Subject()
  endAt = new Subject()
  users

 sub
 userId
 user
 userFriends
 friendsAmount

 friendslist = true;
 request = false;
 serach = false;
 currentUserId

  constructor(private db: AngularFireDatabase,
  	          private route: ActivatedRoute,
              private router: Router,
              public afAuth: AuthService,
              public findFriends: FindFriendsService,
              public manipulate:ManipulationService,
              public modalSupport: ModalSupportService,
              public friendsList: FriendsListService) { }

friendsListActive() {
 this.friendslist = true;
 this.request = false;
 this.serach = false;
}

requestActive(){
  this.friendslist = false;
  this.request = true;
  this.serach = false;
}

serachActive() {
  this.friendslist = false;
  this.request = false;
  this.serach = true;
}
search($event){
  let q = $event.target.value
  this.startsAt.next(q)
  this.endAt.next(q+"\uf8ff")
}

addFriend(){
  this.currentUserId = this.afAuth.currentUserId
  this.db.object(`/users/${this.userId}/friends`).update({ [this.currentUserId]: false })
  this.db.object(`/users/${this.currentUserId}/friends`).update({[this.userId]: true})
}

  ngOnInit() {

  	this.sub = this.route.params.subscribe(params=>
      {                    
        this.userId = params['userId'] 
        this.friendsList.friendsList(this.userId)        
        this.user = this.db.object('/users/'+params['userId'])
            
    })	
    this.findFriends.getUsers(this.startsAt, this.endAt).subscribe(users=>this.users = users)

  }

}
