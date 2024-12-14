import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormPengajuan } from '../../../interfaces/i-form-pengajuan';
import { PengajuanService } from '../../../services/pengajuan_klaim/pengajuan.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { numericValidator } from '../../../../validators';
import { UserStorageService } from '../../../services/storage/user-storage.service';

const currentDate = new Date();

@Component({
  selector: 'app-form-pengajuan-klaim',
  templateUrl: './form-pengajuan-klaim.component.html',
  styleUrls: ['./form-pengajuan-klaim.component.scss']
})
export class FormPengajuanKlaimComponent implements OnInit {
  insuranceForm: FormGroup;
  isVehicleInsurance = false;
  isOtherInsurance = false;
  listDocs: any[] = [];
  idCustomer: any;
  user:string = UserStorageService.getUserRole();


  constructor(private fb: FormBuilder, private pengajuanService: PengajuanService, private message: NzMessageService,
  private router: Router) {}

  ngOnInit(): void {
    this.insuranceForm = this.fb.group({
      idKontrak: ['', [Validators.required, numericValidator]],
      noPolis: ['', [Validators.required, numericValidator]],
      namaCustomer: [{ value: '', disabled: true }],
      produkAsuransi: ['', Validators.required],
      tanggalPengajuan: [currentDate, Validators.required],
      ktp: [null],
      kk: [null],
      stnk: [null],
      bpkb: [null],
      suratDokter: [null],
      suratKematian: [null],
      suratWasiat: [null],
      noKtp: [{ value: '', disabled: true }],
      noTelepon: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      alamat: [{ value: '', disabled: true }],
      description: ['', Validators.required]
    });
  
    this.insuranceForm.get('produkAsuransi')?.valueChanges.subscribe(() => {
      this.setValidators();
      this.updateInsuranceType();
    });
  }

  setValidators(): void {
    const produkAsuransi = this.insuranceForm.get('produkAsuransi')?.value;
    const controls = this.insuranceForm.controls;
    const required = Validators.required;
  
    // Set validators for required fields based on product insurance
    controls['ktp'].setValidators(required);
    controls['kk'].setValidators(required);
  
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
      controls['stnk'].clearValidators();
      controls['bpkb'].clearValidators();
      controls['suratDokter'].clearValidators();
      controls['suratKematian'].clearValidators();
      controls['suratWasiat'].clearValidators();
    }
  
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
      this.insuranceForm.controls[controlName].clearValidators();
      this.insuranceForm.controls[controlName].updateValueAndValidity();
    }
  }

  getNoContract(): void {
    const noContract = this.insuranceForm.get('idKontrak')?.value;
  
    if (noContract) {
      this.pengajuanService.getContractData(noContract).subscribe(
        (res) => {
          res.dataCustomerFile.forEach((file) => {
            this.listDocs.push(file.idMasterDoc.id);
          });
  
          console.log('List Docs:', this.listDocs);
  
          this.idCustomer = res.dataKontrak.idCustomer.idCustomer;
          console.log('idCustomer:', this.idCustomer);
  
          this.insuranceForm.patchValue({
            namaCustomer: res.dataKontrak.idCustomer.namaCustomer,
            noKtp: res.dataKontrak.idCustomer.noKtp,
            noTelepon: res.dataKontrak.idCustomer.noTelepon,
            email: res.dataKontrak.idCustomer.email,
            alamat: res.dataKontrak.idCustomer.alamat
          });
  
          this.updateDocumentValidators();
        },
        (error) => console.log('Error fetching contract data:', error)
      );
    } else {
      console.log('No contract number provided');
    }
  }

  updateDocumentValidators(): void {
    const documentFields = ['ktp', 'kk', 'stnk', 'bpkb', 'suratDokter', 'suratKematian', 'suratWasiat'];
    
    documentFields.forEach((field) => {
      if (this.listDocs.includes(this.getDocumentIdByField(field))) {
        this.insuranceForm.controls[field].clearValidators();
      } else {
        this.insuranceForm.controls[field].setValidators(Validators.required);
      }
      this.insuranceForm.controls[field].updateValueAndValidity();
    });
  }

  getDocumentIdByField(field: string): number {
    const mapping = {
      'ktp': 1,
      'kk': 2,
      'stnk': 3,
      'bpkb': 4,
      'suratDokter': 5,
      'suratKematian': 6,
      'suratWasiat': 7
    };
    return mapping[field] || 0;
  }

  submitForm(): void {
    if (!this.idCustomer) {
      console.log('idCustomer kosong, memanggil getNoContract...');
      this.getNoContract();
      return; // Prevent form submission until customer data is fetched
    }

    // Proceed with form submission
    const formData = new FormData();
    const values = this.insuranceForm.getRawValue();

    formData.append('id-contract', values.idKontrak);
    formData.append('id-customer', this.idCustomer);
    formData.append('no-polis', values.noPolis);
    formData.append('jenis-asuransi', values.produkAsuransi || '');
    formData.append('description', values.description || '');

    const fileFields = ['ktp', 'kk', 'stnk', 'bpkb', 'suratDokter', 'suratKematian', 'suratWasiat'];
    fileFields.forEach((field, index) => {
      if (values[field]) {
        const fileName = `${index + 1}.jpeg`;
        formData.append('files', values[field], fileName);
      }
    });


    this.pengajuanService.uploadInsuranceDocuments(formData).subscribe(
      (res) => {
        // Assuming response is successful (you can adjust based on actual response from the backend)
        if (res.status === 'success') {
          this.message.success('Klaim berhasil diajukan.');
    
          // Kirim log aktivitas setelah klaim berhasil diajukan
          this.pengajuanService.logActivity(
            `Mengajukan klaim untuk ${values.jenisAsuransi} dengan nomor kontrak ${values?.idKontrak.idKontrak} dan nomor polis ${values?.noPolis}`,
            this.user === "ADMIN" ? "Admin" : "Imanuel"
          ).subscribe({
            next: () => {
              console.log('Log aktivitas berhasil dikirim');
            },
            error: (err) => {
              console.error('Gagal mengirim log aktivitas:', err);
            }
          });
    
        } else {
          // In case there's an unexpected issue with the backend, show a general error
          this.message.error('Klaim tidak berhasil diajukan. Silakan coba lagi.');
        }
        this.router.navigate(['/dashboard']); // Always navigate to dashboard after the operation
      },
      (error) => {
        // Handle error 500 and other errors
        if (error.status === 500) {
          this.message.error('Klaim tidak berhasil diajukan. Silakan coba lagi.');
        } else {
          this.message.error('Klaim tidak berhasil diajukan. Silakan coba lagi.');
        }
    
        // Kirim log aktivitas untuk error
        this.pengajuanService.logActivity(
          `Gagal mengajukan klaim untuk ${values.jenisAsuransi} dengan nomor kontrak ${values?.idKontrak.idKontrak} dan nomor polis ${values?.noPolis}`,
          this.user === "ADMIN" ? "Admin" : "Imanuel"
        ).subscribe({
          next: () => {
            console.log('Log aktivitas gagal dikirim');
          },
          error: (err) => {
            console.error('Gagal mengirim log aktivitas untuk error:', err);
          }
        });
    
        this.router.navigate(['/dashboard']); // Navigate to dashboard on error as well
      }
    );
    
    
}

  
}
