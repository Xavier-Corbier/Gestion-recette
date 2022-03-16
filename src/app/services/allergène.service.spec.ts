import { TestBed } from '@angular/core/testing';

import { AllergèneService } from './allergène.service';

describe('AllergèneService', () => {
  let service: AllergèneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllergèneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
