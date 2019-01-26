import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {AuthService} from '../../../services/authorization.service';
import {IMyDpOptions} from 'mydatepicker';
import {ManipulationService} from '../../../services/manipulation.service';

@Component({
  selector: 'peronal-information',
  templateUrl: './peronal-information.component.html',
  styleUrls: ['./peronal-information.component.css']
})
export class PeronalInformationComponent implements OnInit {
  personalInfoForm: FormGroup;
  currentUserId
  birthday 
  homeCity 
  languages  
  work 
  status  
  instagram 
  facebook 
  twitter 
  email              
  phone  
  about
  name

  constructor( private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public afAuth: AuthService,
              public manipulate:ManipulationService) { }

  private buildForm() {
    this.personalInfoForm = this.fb.group({
      name:"",
      birthday:'',
      homeCity: '',    	
      languages:'',
      work:'',      
      status: '',
      about: '',
      instagram:'',
      facebook:'',
      twitter: '',
      email: '',
      phone:'',          
    });
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  ngOnInit() {
  	this.currentUserId = this.afAuth.currentUserId

  	this.db.object(`users/${this.currentUserId}`).subscribe(personalInfoSnapshot => {
      this.name = personalInfoSnapshot.name
      this.birthday = personalInfoSnapshot.birthday
      this.homeCity = personalInfoSnapshot.homeCity
      this.languages = personalInfoSnapshot.languages
      this.work = personalInfoSnapshot.work
      this.status = personalInfoSnapshot.status
      this.instagram = personalInfoSnapshot.instagram   
      this.facebook = personalInfoSnapshot.facebook
      this.twitter = personalInfoSnapshot.twitter
      this.email = personalInfoSnapshot.email                 
      this.phone = personalInfoSnapshot.phone         
    })
  	this.buildForm()
  }

  savePersonalInfo(){
    if (this.personalInfoForm.status != 'VALID') {
          console.log('form is not valid, cannot save to database')
          return
    }     
  
    const data = this.personalInfoForm.value
    const newDetails = this.db.object(`users/${this.currentUserId}`)
    if(data.birthday != undefined){
      newDetails.update({"birthday":data.birthday})
    }
    if(data.homeCity != undefined){
      newDetails.update({"homeCity":data.homeCity})
    }
    if(data.work != undefined){
      newDetails.update({"work":data.work})
    }
    if(data.status != undefined){
      newDetails.update({"status":data.status})
    }
    if(data.languages != undefined){
      newDetails.update({"languages":data.languages})
    }
    if(data.instagram != undefined){
      newDetails.update({"instagram":data.instagram})
    }
    if(data.facebook != undefined){
      newDetails.update({"facebook":data.facebook})
    }
    if(data.twitter != undefined){
      newDetails.update({"twitter":data.twitter})
    }  
    if(data.email != undefined){
      newDetails.update({"email":data.email})
    }
    if(data.phone != undefined){
      newDetails.update({"phone":data.phone})
    }  
    if(data.about != undefined){
      newDetails.update({"about":data.about})
    } 
    if(data.name != undefined){
      newDetails.update({"name":data.name})
    } 
    this.manipulate.togglepersonalnfo()
  }

}
