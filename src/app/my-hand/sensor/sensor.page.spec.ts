import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorPage } from './sensor.page';

describe('SensorPage', () => {
  let component: SensorPage;
  let fixture: ComponentFixture<SensorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
