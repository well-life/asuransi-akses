import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormPengajuan } from '../../../interfaces/i-form-pengajuan';
import { PengajuanService } from '../../../services/pengajuan_klaim/pengajuan.service';

@Component({
  selector: 'app-form-pengajuan-klaim',
  templateUrl: './form-pengajuan-klaim.component.html',
  styleUrls: ['./form-pengajuan-klaim.component.scss']
})
export class FormPengajuanKlaimComponent implements OnInit {
  insuranceForm: FormGroup;
  isVehicleInsurance = false;
  isOtherInsurance = false;

  constructor(private fb: FormBuilder, private pengajuanService: PengajuanService) {}

  ngOnInit(): void {
    this.insuranceForm = this.fb.group({
      noKontrak: ['', Validators.required],
      namaCustomer: ['', Validators.required],
      produkAsuransi: ['', Validators.required],
      tanggalPengajuan: ['', Validators.required],
      ktp: [null],
      kk: [null],
      stnk: [null],
      bpkb: [null],
      suratDokter: [null],
      suratKematian: [null],
      suratWasiat: [null],
    });

    this.insuranceForm.get('produkAsuransi')?.valueChanges.subscribe(() => {
      this.setValidators();
      this.updateInsuranceType();
    }) ;
  }

  setValidators(): void {
    const produkAsuransi = this.insuranceForm.get('produkAsuransi')?.value;
    const controls = this.insuranceForm.controls;
    const required = Validators.required;
  
    // Set validators for common fields
    controls['ktp'].setValidators(required);
    controls['kk'].setValidators(required);
  
    // Validate fields based on insurance type
    if (produkAsuransi === 'asuransiKendaraan' || produkAsuransi === 'carProtection') {
      controls['stnk'].setValidators(required);
      controls['bpkb'].setValidators(required);
      controls['suratDokter'].clearValidators();
      controls['suratKematian'].clearValidators();
      controls['suratWasiat'].clearValidators();
    } else if (produkAsuransi === 'creditProtection' || produkAsuransi === 'personalAccident') {
      controls['stnk'].setValidators(required);
      controls['bpkb'].setValidators(required);
      controls['suratDokter'].setValidators(required);
      controls['suratKematian'].setValidators(required);
      controls['suratWasiat'].setValidators(required);
    } else {
      // Clear all specific document fields for undefined insurance types
      controls['stnk'].clearValidators();
      controls['bpkb'].clearValidators();
      controls['suratDokter'].clearValidators();
      controls['suratKematian'].clearValidators();
      controls['suratWasiat'].clearValidators();
    }
  
    // Update validity for all controls without emitting value changes
    Object.keys(controls).forEach((key) => {
      controls[key].updateValueAndValidity({ emitEvent: false });
    });
  }

  updateInsuranceType(): void {
    const produkAsuransi = this.insuranceForm.get('produkAsuransi')?.value;
    this.isVehicleInsurance = produkAsuransi === 'asuransiKendaraan' || produkAsuransi === 'carProtection';
    this.isOtherInsurance = produkAsuransi === 'creditProtection' || produkAsuransi === 'personalAccident';
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.insuranceForm.patchValue({
        [controlName]: file
      });
    }
  }
  

  submitForm(): void {
    if (this.insuranceForm.valid) {
      const formData = new FormData();
      const values = this.insuranceForm.value;
      
      formData.append('no-kontrak', values.noKontrak);
      formData.append('nama-customer', values.namaCustomer);
      formData.append('jenis-asuransi', values.produkAsuransi);
      formData.append('tanggal-pengajuan', values.tanggalPengajuan);
  
      // Append file fields
      const fileFields = ['ktp', 'kk', 'stnk', 'bpkb', 'suratDokter', 'suratKematian', 'suratWasiat'];
      fileFields.forEach((field) => {
        if (values[field]) {
          formData.append('files', values[field]);
        }
      });
  
      console.log(formData); // Debug: log data yang akan dikirim
  
      this.pengajuanService.uploadInsuranceDocuments(formData).subscribe(
        (res) =>{ 
          console.log('Data berhasil dikirim', this.insuranceForm),
          this.insuranceForm.reset();
        },
        (error) => console.log('Error uploading documents:', error)
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
