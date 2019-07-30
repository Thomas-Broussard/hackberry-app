import { TestBed } from '@angular/core/testing';

import { HackberryDocService } from './hackberry-doc.service';

describe('HackberryDocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HackberryDocService = TestBed.get(HackberryDocService);
    expect(service).toBeTruthy();
  });
});
