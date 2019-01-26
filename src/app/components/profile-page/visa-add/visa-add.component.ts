import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {IMyDpOptions} from 'mydatepicker';
import {ModalSupportService} from '../../../services/modal-support.service';

@Component({
  selector: 'app-visa-add',
  templateUrl: './visa-add.component.html',
  styleUrls: ['./visa-add.component.css']
})
export class VisaAddComponent implements OnInit {
  visaForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
  	          private db: AngularFireDatabase,
              public modalSupport: ModalSupportService) { }

  private buildForm() {
    this.visaForm = this.fb.group({
      type:    ['', Validators.required ],
      number: '',    	
      issuedIn: ['', Validators.required ],
      issued:  ['', Validators.required ],      
      expires: ['', Validators.required ],          
    });
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  }

  ngOnInit() {
  	this.buildForm()  	
  }

  addVisa(){
    if (this.visaForm.status != 'VALID') {
      console.log(Error)
      return Error
    } 
    const data = this.visaForm.value
    
    const visaKey = this.db.list(`privateInformation/${this.modalSupport.userId}`).push({
      "type":data.type,
      "number":data.number,
      "issuedIn":data.issuedIn,                                           
    }).key

    this.db.object(`privateInformation/${this.modalSupport.userId}/${visaKey}`)
          .update({
            "issued":data.issued,
            "expires":data.expires 
    })  

    this.bsModalRef.hide()
  }

}
