import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorCalibrationPage } from './sensor-calibration.page';

describe('SensorCalibrationPage', () => {
  let component: SensorCalibrationPage;
  let fixture: ComponentFixture<SensorCalibrationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorCalibrationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorCalibrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
