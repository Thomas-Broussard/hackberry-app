import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsUsagePage } from './buttons-usage.page';

describe('ButtonsUsagePage', () => {
  let component: ButtonsUsagePage;
  let fixture: ComponentFixture<ButtonsUsagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsUsagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsUsagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
