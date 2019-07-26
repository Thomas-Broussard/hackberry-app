import { TestBed } from '@angular/core/testing';

import { HackberryDevice } from './hackberry-device.service';

describe('HackberryDevice', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HackberryDevice = TestBed.get(HackberryDevice);
    expect(service).toBeTruthy();
  });
});
