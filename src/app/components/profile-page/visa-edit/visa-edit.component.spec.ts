import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaEditComponent } from './visa-edit.component';

describe('VisaEditComponent', () => {
  let component: VisaEditComponent;
  let fixture: ComponentFixture<VisaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
