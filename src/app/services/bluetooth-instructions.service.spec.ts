import { TestBed } from '@angular/core/testing';

import { BluetoothInstructions } from './bluetooth-instructions.service';

describe('BluetoothInstructions', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BluetoothInstructions = TestBed.get(BluetoothInstructions);
    expect(service).toBeTruthy();
  });
});
