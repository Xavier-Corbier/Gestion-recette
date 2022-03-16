import { TestBed } from '@angular/core/testing';

import { ManageDatabaseService } from './manage-database.service';

describe('ManageDatabaseService', () => {
  let service: ManageDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
