import { Component, OnInit, HostBinding } from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../../../services/authorization.service';
import {ManipulationService} from '../../../services/manipulation.service';

import { AngularFireModule  } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;
  userInfo: FirebaseObjectObservable<any>;
  userId

  constructor(public manipulate:ManipulationService,
              public afAuth: AuthService,
              private db: AngularFireDatabase,
  			      private router: Router) { 
    this.userId = afAuth.currentUserId;
    this.userInfo = db.object('users/'+ this.userId); 
}

  private afterSignIn(): void {
  this.userInfo.update({userId: this.userId})
  // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['/user']);
  }

  signInWithGoogle(): void {
    this.afAuth.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook(): void {
    this.afAuth.facebookLogin()
      .then(() => this.afterSignIn());
  }

  signInWithTwitter(): void {
    this.afAuth.twitterLogin()
      .then(() => this.afterSignIn());
  }

  ngOnInit() {
  }

}
