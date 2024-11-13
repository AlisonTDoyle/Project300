import { TestBed } from '@angular/core/testing';

import { DatabaseHandlerService } from './database-handler.service';

describe('DatabaseHandlerService', () => {
  let service: DatabaseHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
