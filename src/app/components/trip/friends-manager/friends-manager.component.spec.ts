import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsManagerComponent } from './friends-manager.component';

describe('FriendsManagerComponent', () => {
  let component: FriendsManagerComponent;
  let fixture: ComponentFixture<FriendsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
