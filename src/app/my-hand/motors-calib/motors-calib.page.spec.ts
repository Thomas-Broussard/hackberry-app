import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorsCalibPage } from './motors-calib.page';

describe('MotorsCalibPage', () => {
  let component: MotorsCalibPage;
  let fixture: ComponentFixture<MotorsCalibPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorsCalibPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorsCalibPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
