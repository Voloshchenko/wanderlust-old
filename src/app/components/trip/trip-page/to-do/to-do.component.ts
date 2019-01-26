import { Component, OnInit, Input  } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {
 @Input() userId
 @Input() tripId 
 toDo
 taskVal: string = '';


  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  	this.toDo = this.db.list(`toDo/${this.userId}/${this.tripId}/`)
  }

  addTask(task: string) {
      this.toDo.push({ task: task});
      this.taskVal = '';
  }

}
