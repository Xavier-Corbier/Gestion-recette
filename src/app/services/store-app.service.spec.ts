import { TestBed } from '@angular/core/testing';

import { StoreAppService } from './store-app.service';

describe('StoreAppService', () => {
  let service: StoreAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
