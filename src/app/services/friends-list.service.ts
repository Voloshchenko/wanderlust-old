import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class FriendsListService {
userFriends

user
friends = []
requestSend = []
requestReceived = []

  constructor(private db: AngularFireDatabase) { }

  friendsList(userId){
    this.friends = []
    this.requestSend = []
    this.requestReceived = []
    this.user = this.db.object(`/users/${userId}`).subscribe(
      userSnap=> {
        if(userSnap.friends != undefined){
           this.userFriends = Object.keys(userSnap.friends) 
            this.userFriends.forEach(friend => { 
              if(userSnap.friends[friend] == true){
              	this.db.object(`/users/${friend}`)              	
              	.subscribe(friendSnap=>{           		
              		if(friendSnap.friends[userId] == true){
              			this.friends.push(friendSnap)
              		} else if(friendSnap.friends[userId] == false){
              			this.requestSend.push(friendSnap)
                    
              		}
              	})
 
              } else if(userSnap.friends[friend] == false){
              	this.db.object(`/users/${friend}`)              	
              	.subscribe(friendSnap=>{              		
              		if(friendSnap.friends[userId] == true){
              			this.requestReceived.push(friendSnap)
              		}
              	})

              }
            })
        }
    })
  }
}
