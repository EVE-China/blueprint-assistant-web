import { TestBed } from '@angular/core/testing';

import { BluePrintService } from './blue-print.service';

describe('BluePrintService', () => {
  let service: BluePrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluePrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
