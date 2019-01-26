import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';


import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import {ModalSupportService} from '../../../services/modal-support.service';


@Component({
  selector: 'new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  newPostForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
 	          private fb: FormBuilder,
              private db: AngularFireDatabase,
              public modalSupport: ModalSupportService) { }

  private buildForm() {
    this.newPostForm = this.fb.group({ 
      postBody: ['', Validators.required ],
      postTitle: ['', Validators.required ]
    });
  }

  ngOnInit() {
  	this.buildForm()  	
  }

   saveNewPost(){
    if (this.newPostForm.status != 'VALID') {
      console.log('form is not valid, cannot save to database')
      return
    } 
    const data = this.newPostForm.value
    this.db.list(`tripposts/${this.modalSupport.tripId}`)
      .push({
          "title": data.postTitle,
          "body": data.postBody,
          "postedBy": this.modalSupport.userId
      }) 
    this.bsModalRef.hide()    
  }

}
