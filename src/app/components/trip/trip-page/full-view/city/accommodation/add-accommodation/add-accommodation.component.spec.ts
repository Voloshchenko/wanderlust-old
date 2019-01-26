import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccommodationComponent } from './add-accommodation.component';

describe('AddAccommodationComponent', () => {
  let component: AddAccommodationComponent;
  let fixture: ComponentFixture<AddAccommodationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccommodationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
