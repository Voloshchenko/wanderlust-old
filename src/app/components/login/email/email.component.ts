import { Component, OnInit } from '@angular/core';
import { AngularFireModule  } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/authorization.service';
import {ManipulationService} from '../../../services/manipulation.service';

import * as firebase from 'firebase/app';
@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
 error: any;
  authState: any = null;

  userInfo: FirebaseObjectObservable<any>;
  userId


  constructor(public afAuth: AuthService,
  			  private db: AngularFireDatabase,
  			  private router: Router,
          public manipulate:ManipulationService) { }

  private afterSignIn(): void {
    this.userId = this.afAuth.currentUserId;
    this.userInfo = this.db.object('users/'+ this.userId)
    this.userInfo.update({userId: this.userId})
  // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['/user']);
  }
  signInWithEmail(e): void {
    this.afAuth.emailLogin(e)
      .then(() => this.afterSignIn());
  }

  ngOnInit() {
  }


}
