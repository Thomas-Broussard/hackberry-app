import { TestBed } from '@angular/core/testing';

import { BluetoothService } from './bluetooth-service.service';

describe('BluetoothService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BluetoothService = TestBed.get(BluetoothService);
    expect(service).toBeTruthy();
  });
});
