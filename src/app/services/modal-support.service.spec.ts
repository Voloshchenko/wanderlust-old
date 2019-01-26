import { TestBed, inject } from '@angular/core/testing';

import { ModalSupportService } from './modal-support.service';

describe('ModalSupportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalSupportService]
    });
  });

  it('should be created', inject([ModalSupportService], (service: ModalSupportService) => {
    expect(service).toBeTruthy();
  }));
});
