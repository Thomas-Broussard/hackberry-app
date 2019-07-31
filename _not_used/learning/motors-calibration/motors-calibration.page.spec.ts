import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorsCalibrationPage } from './motors-calibration.page';

describe('MotorsCalibrationPage', () => {
  let component: MotorsCalibrationPage;
  let fixture: ComponentFixture<MotorsCalibrationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorsCalibrationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorsCalibrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
