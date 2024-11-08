import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPengajuanKlaimComponent } from './form-pengajuan-klaim.component';

describe('FormPengajuanKlaimComponent', () => {
  let component: FormPengajuanKlaimComponent;
  let fixture: ComponentFixture<FormPengajuanKlaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormPengajuanKlaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPengajuanKlaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
