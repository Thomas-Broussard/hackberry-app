import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyGuidePage } from './assembly-guide.page';

describe('AssemblyGuidePage', () => {
  let component: AssemblyGuidePage;
  let fixture: ComponentFixture<AssemblyGuidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyGuidePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
