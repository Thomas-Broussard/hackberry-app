import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorCalibPage } from './sensor-calib.page';

describe('SensorCalibPage', () => {
  let component: SensorCalibPage;
  let fixture: ComponentFixture<SensorCalibPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorCalibPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorCalibPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
