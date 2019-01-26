import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {ManipulationService} from '../../../services/manipulation.service';

import {AuthService} from '../../../services/authorization.service';


@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	authState: any = null;

  constructor(public afAuth: AuthService,
  	          private router: Router,
          public manipulate:ManipulationService
  	) { }

  private afterSignIn(): void {
  // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['/user']);
  }

  signUpWithEmail(e): void {    
    console.log(e.target)
    this.afAuth.emailSignUp(e)
      .then(() => this.afterSignIn())
  }

  ngOnInit() {
  }

}
