import { TestBed } from '@angular/core/testing';

import { BonusService } from './bonus.service';

describe('BonusService', () => {
  let service: BonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
