import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
 @Input()friendId
 name
 status
 img

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.object(`/users/${this.friendId}/`).subscribe(profileSnapShot=>{
      this.name = profileSnapShot.name
      this.status = profileSnapShot.status
      this.img = profileSnapShot.imgUrl
    })
  }

}
