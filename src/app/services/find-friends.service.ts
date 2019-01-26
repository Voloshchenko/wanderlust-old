import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class FindFriendsService {

  constructor(private db: AngularFireDatabase) { }

  getUsers(start, end): FirebaseListObservable<any>{
	return this.db.list('/users', {
	  query: {
		orderByChild: 'name',
		limitToFirst: 10,
		startAt: start,
		endAt: end
	  }
	})
  }
}
