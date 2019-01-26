import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaAddComponent } from './visa-add.component';

describe('VisaAddComponent', () => {
  let component: VisaAddComponent;
  let fixture: ComponentFixture<VisaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
