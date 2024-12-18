import { TestBed } from '@angular/core/testing';

import { LeaveHourService } from './leave-hour.service';

describe('LeaveHourService', () => {
  let service: LeaveHourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveHourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
