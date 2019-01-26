import { Component, OnInit } from '@angular/core';
import {ManipulationService} from '../../services/manipulation.service';


@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  constructor(public manipulate:ManipulationService) {}
  ngOnInit() {
    }
}
