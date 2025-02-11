import { TestBed } from '@angular/core/testing';

import { TimetableApiService } from './timetable-api.service';

describe('TimetableApiService', () => {
  let service: TimetableApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
