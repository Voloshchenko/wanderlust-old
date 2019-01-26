import { Component, OnInit } from '@angular/core';
import {ManipulationService} from '../../../services/manipulation.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(public manipulate:ManipulationService) { }

  ngOnInit() {
  }

}
