import { TestBed } from '@angular/core/testing';

import { FreecellDbService } from './freecell-db.service';

describe('FreecellDbService', () => {
  let service: FreecellDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreecellDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
