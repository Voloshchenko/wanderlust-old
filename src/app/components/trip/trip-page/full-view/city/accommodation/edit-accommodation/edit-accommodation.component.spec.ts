import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccommodationComponent } from './edit-accommodation.component';

describe('EditAccommodationComponent', () => {
  let component: EditAccommodationComponent;
  let fixture: ComponentFixture<EditAccommodationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccommodationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
