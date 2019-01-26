import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {IMyDpOptions} from 'mydatepicker';
import {ModalSupportService} from '../../../services/modal-support.service';


@Component({
  selector: 'app-visa-edit',
  templateUrl: './visa-edit.component.html',
  styleUrls: ['./visa-edit.component.css']
})
export class VisaEditComponent implements OnInit {
  visaForm: FormGroup;
  type
  number
  issuedIn
  issued
  expires

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
    this.db.object(`privateInformation/${this.modalSupport.userId}/${this.modalSupport.visaId}`)
      .subscribe(
        visaSnap=> {
          this.type = visaSnap.type
          this.number = visaSnap.number
          this.issuedIn = visaSnap.issuedIn
          this.issued = visaSnap.issued
          this.expires = visaSnap.expires
        })
    this.buildForm()    
  }

  editVisa(){
    if (this.visaForm.status != 'VALID') {
      console.log(Error)
      return Error
    } 
    const data = this.visaForm.value
    
    this.db.object(`privateInformation/${this.modalSupport.userId}/${this.modalSupport.visaId}`)
          .update({
            "type":data.type,
            "number":data.number,
            "issuedIn":data.issuedIn,            
            "issued":data.issued,
            "expires":data.expires 
    })  

    this.bsModalRef.hide()
  }

}
