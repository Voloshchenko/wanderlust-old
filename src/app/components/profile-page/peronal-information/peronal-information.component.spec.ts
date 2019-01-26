import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeronalInformationComponent } from './peronal-information.component';

describe('PeronalInformationComponent', () => {
  let component: PeronalInformationComponent;
  let fixture: ComponentFixture<PeronalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeronalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeronalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
