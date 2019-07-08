import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorsPage } from './motors.page';

describe('MotorsPage', () => {
  let component: MotorsPage;
  let fixture: ComponentFixture<MotorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
