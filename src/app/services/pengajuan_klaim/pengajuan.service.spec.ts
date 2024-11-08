import { TestBed } from '@angular/core/testing';

import { PengajuanService } from './pengajuan.service';

describe('PengajuanService', () => {
  let service: PengajuanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PengajuanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
