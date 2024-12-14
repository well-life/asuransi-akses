import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PengajuanService } from '../../../services/pengajuan_klaim/pengajuan.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-klaim',
  templateUrl: './edit-klaim.component.html',
  styleUrls: ['./edit-klaim.component.scss']
})
export class EditKlaimComponent implements OnInit {
  insuranceForm: FormGroup;
  claimId: string;
  listDocs: any[] = [];
  claimStatus = 0;
  idCustomer: any;
  isVehicleInsurance = false;
  isOtherInsurance = false;

  constructor(
    private fb: FormBuilder,
    private pengajuanService: PengajuanService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.insuranceForm = this.fb.group({
      idKontrak: [{ value: '', disabled: true }],
      noPolis: [{ value: '', disabled: true }],
      namaCustomer: [{ value: '', disabled: true }],
      produkAsuransi: [{ value: '', disabled: true }],
      tanggalPengajuan: [new Date(), Validators.required],
      noKtp: [{ value: '', disabled: true }],
      noTelepon: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      description: [''],
      notes: [{ value: '', disabled: true }],
      alamat:[{ value: '', disabled: true }],
      ktp: [null],
      kk: [null],
      stnk: [null],
      bpkb: [null],
      suratDokter: [null],
      suratKematian: [null],
      suratWasiat: [null]
    });

    this.route.paramMap.subscribe((params) => {
      this.claimId = params.get('id') || '';
      if (this.claimId) {
        this.loadClaimData(this.claimId);
      }
    });
  }

  loadClaimData(claimId: string): void {
    this.pengajuanService.getClaimById(claimId).subscribe(
      (res) => {
        const claimData = res.klaim;
        this.listDocs = res.dokumen || [];
        this.idCustomer = claimData.idCustomer.idCustomer;
  
        this.insuranceForm.patchValue({
          idKontrak: claimData.idKontrak.idKontrak,
          namaCustomer: claimData.idCustomer.namaCustomer,
          produkAsuransi: claimData.jenisAsuransi,
          tanggalPengajuan: new Date(claimData.createdAt),
          noKtp: claimData.idCustomer.noKtp,
          noTelepon: claimData.idCustomer.noTelepon,
          email: claimData.idCustomer.email,
          alamat: claimData.idCustomer.alamat,
          noPolis: claimData.noPolis,
          notes: claimData.notes,
          description: claimData.description
        });
  
        this.updateInsuranceType();
        this.claimStatus = claimData.status;
        this.getNoContract();

        console.log(claimData);
      },
      (error) => console.error('Error loading claim data:', error)
     
    );
  }

  updateInsuranceType(): void {
    const produkAsuransi = this.insuranceForm.get('produkAsuransi')?.value;
    this.isVehicleInsurance = produkAsuransi === 'asuransiKendaraan' || produkAsuransi === 'carProtection';
    this.isOtherInsurance = produkAsuransi === 'creditProtection' || produkAsuransi === 'personalAccident';
    console.log(this.isOtherInsurance);
  }
  

  getNoContract(): void {
    const noContract = this.insuranceForm.get('idKontrak')?.value;
  
    if (noContract) {
      this.pengajuanService.getContractData(noContract).subscribe(
        (res) => {
          res.dataCustomerFile.forEach((file) => {
            this.listDocs.push(file.idMasterDoc.id);  // Menambahkan ID dokumen ke listDocs
          });
  
          console.log('List Docs:', this.listDocs);
  
          this.idCustomer = res.dataKontrak.idCustomer.idCustomer;
          console.log('idCustomer:', this.idCustomer);

          this.insuranceForm.patchValue({
            namaCustomer: res.dataKontrak.idCustomer.namaCustomer,
            noKtp: res.dataKontrak.idCustomer.noKtp,
            noTelepon: res.dataKontrak.idCustomer.noTelepon,
            email: res.dataKontrak.idCustomer.email,
            alamat: res.dataKontrak.idCustomer.alamat,
          });
  
          this.updateDocumentValidators(); // Sesuaikan validasi dokumen setelah memuat data kontrak
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
      if (this.listDocs.includes(field)) {
        this.insuranceForm.controls[field].setValidators([Validators.required]);
      } else {
        this.insuranceForm.controls[field].clearValidators();
      }
    });
  }

  onFileChange(event: any, documentType: string): void {
    const file = event.target.files[0];
    if (file) {
      this.insuranceForm.patchValue({ [documentType]: file });
    }
  }

  submitForm(): void {
    if (this.insuranceForm.invalid) {
        for (const control in this.insuranceForm.controls) {
            this.insuranceForm.controls[control].markAsTouched();
        }
        return;
    }

    if (!this.claimId) {
        this.message.error('ID Klaim tidak valid. Silakan coba lagi.');
        return;
    }

    const formData = new FormData();
    const values = this.insuranceForm.getRawValue();

    formData.append('id-contract', values.idKontrak);
    formData.append('id-customer', this.idCustomer);
    formData.append('jenis-asuransi', values.produkAsuransi || '');
    formData.append('description', values.description || '');
    formData.append('claimId', this.claimId); // Tambahkan klaim ID

    // Validasi dan tambahkan file
    const documentFields = ['ktp', 'kk', 'stnk', 'bpkb', 'suratDokter', 'suratKematian', 'suratWasiat'];
    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    // Loop untuk menangani file dan menambahkan file ke FormData
    documentFields.forEach((field, index) => {
        const file = values[field];
        if (file) {
            // Validasi tipe file
            if (!allowedTypes.includes(file.type)) {
                this.message.error(`${field.toUpperCase()} memiliki format file yang tidak didukung.`);
                return;
            }

            // Validasi ukuran file
            if (file.size > maxSize) {
                this.message.error(`${field.toUpperCase()} melebihi ukuran maksimum 5 MB.`);
                return;
            }

            // Gunakan nama file berdasarkan indeks (1.jpeg, 2.jpeg, dst)
            const fileName = `${index + 1}.jpeg`;
            formData.append('files', file, fileName);
        }
    });

    // Kirim ke server
    this.pengajuanService.updateClaim(formData, this.claimId).subscribe(
      (res) => {
          if (res && res.message) {
              this.message.success(res.message || 'Dokumen berhasil diupdate');
              this.router.navigate(['/dashboard']);
          } else {
              this.message.error('Gagal mengupdate dokumen. Silakan coba lagi.');
          }
      },
      (error) => {
          console.error('Error updating documents:', error);
          this.message.error(error?.error?.message || 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.');
      }
  );
}



}
