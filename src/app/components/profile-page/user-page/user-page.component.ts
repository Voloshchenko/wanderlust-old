import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../../services/authorization.service';
import {FindFriendsService} from '../../../services/find-friends.service';
import {ManipulationService} from '../../../services/manipulation.service';
import {ModalSupportService} from '../../../services/modal-support.service';
import {FriendsListService} from '../../../services/friends-list.service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Subject} from 'rxjs/Subject'
@Component({
  selector: 'user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  currentUserId;
  user;userId; privateInfo
  userRout
  users;
  userFriends
  sub
  userProfile

  editMode = false; 

  ownProfile = false; 
  friend = false; 
  pending = false; 
  stranger  = true; 
  friendsAmount
  personalInfo
  editPhotoActive = false
  userPostsList
  tripPosts = []

  constructor(private db: AngularFireDatabase,
  	          private route: ActivatedRoute,
              private router: Router,
              public afAuth: AuthService,
              public findFriends: FindFriendsService,
              public manipulate:ManipulationService,
              public modalSupport: ModalSupportService,
              public friendsList: FriendsListService) { }


  ngOnInit() {
  	this.currentUserId = this.afAuth.currentUserId
  	this.sub = this.route.params.subscribe(params=>
      {                    
      this.userId = params['userId'] 
      this.user = this.db.object('/users/'+params['userId'])
      .subscribe(
        userSnap=> {
          this.tripPosts = []
          this.userProfile = userSnap
          this.friendsList.friendsList(this.userId)
          this.userPostsList = Object.keys(userSnap.trips)
          for (var i = 0; this.userPostsList.length > i; i++){
              this.db.list(`tripposts/${this.userPostsList[i]}`)
                .subscribe(userSnapShot=>{
                this.tripPosts.push(userSnapShot) 
              })
          }          

          // this.userPosts = this.db.list(`tripposts/${this.currentUserId}`)
          //   .subscribe(privateSnap=>{
          //     this.personalInfo = privateSnap
          // })


          if(userSnap.$key == this.currentUserId){
            this.ownProfile = true
            this.friend = false; 
            this.pending = false; 
            this.stranger  = false;
            this.privateInfo = this.db.list(`privateInformation/${this.currentUserId}`)
            .subscribe(privateSnap=>{
              this.personalInfo = privateSnap
            })
          }
          

          if (userSnap.$key != this.currentUserId){
            if(userSnap.friends != undefined){
              if (userSnap.friends[this.currentUserId] == true) {
                this.friend = true;
                this.ownProfile = false 
                this.pending = false; 
                this.stranger  = false; 

              } else if (userSnap.friends[this.currentUserId] == false) {              
                this.pending = true;
                this.ownProfile = false                 
                this.friend = false;
                this.stranger  = false;                                   
              } else {
                this.stranger = true;
                this.ownProfile = false                 
                this.friend = false;
                this.pending  = false;                                   
              }
            } else {
                this.stranger = true;
                this.ownProfile = false                 
                this.friend = false;
                this.pending  = false; 
            }
          }
        })      
 	  })


    this.userRout = this.db.database.ref(`trips/${this.userId}`)
    this.userRout.on('value', transportSnapshot => {
       this.userRout = transportSnapshot.val(); 
    })

  }

  uploadPhot(imgUrl: string){
    if(imgUrl!=""){
    this.db.object(`users/${this.userId}`)
    .update({ imgUrl: imgUrl});}
    this.editPhotoActive = false   
  }

  editPhoto(){
    this.editPhotoActive = true
  }






  friendRouting(friendId){
    this.router.navigate(["/profile/"+friendId]);
  }

  friends(){
    this.router.navigate(["friends/"+this.userId]);
  }
    


  ngOnDestory() {
    this.sub.unsubscribe();
}

}
