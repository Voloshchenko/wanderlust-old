import { TestBed, inject } from '@angular/core/testing';

import { TripFunctionsService } from './trip-functions.service';

describe('TripFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TripFunctionsService]
    });
  });

  it('should be created', inject([TripFunctionsService], (service: TripFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
