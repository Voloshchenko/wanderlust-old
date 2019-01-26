import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripMembersComponent } from './trip-members.component';

describe('TripMembersComponent', () => {
  let component: TripMembersComponent;
  let fixture: ComponentFixture<TripMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
