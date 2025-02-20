import { TestBed } from '@angular/core/testing';

import { DatabaseApiService } from './database-api.service';

describe('DatabaseApiService', () => {
  let service: DatabaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
