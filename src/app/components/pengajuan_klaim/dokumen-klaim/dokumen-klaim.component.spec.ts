import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DokumenKlaimComponent } from './dokumen-klaim.component';

describe('DokumenKlaimComponent', () => {
  let component: DokumenKlaimComponent;
  let fixture: ComponentFixture<DokumenKlaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DokumenKlaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DokumenKlaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
