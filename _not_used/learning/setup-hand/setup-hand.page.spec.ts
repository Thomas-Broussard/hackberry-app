import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupHandPage } from './setup-hand.page';

describe('SetupHandPage', () => {
  let component: SetupHandPage;
  let fixture: ComponentFixture<SetupHandPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupHandPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupHandPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
