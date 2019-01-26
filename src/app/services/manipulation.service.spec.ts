import { TestBed, inject } from '@angular/core/testing';

import { ManipulationService } from './manipulation.service';

describe('ManipulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManipulationService]
    });
  });

  it('should be created', inject([ManipulationService], (service: ManipulationService) => {
    expect(service).toBeTruthy();
  }));
});
