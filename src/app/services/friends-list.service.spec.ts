import { TestBed, inject } from '@angular/core/testing';

import { FriendsListService } from './friends-list.service';

describe('FriendsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendsListService]
    });
  });

  it('should be created', inject([FriendsListService], (service: FriendsListService) => {
    expect(service).toBeTruthy();
  }));
});
