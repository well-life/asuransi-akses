import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IKlaimDokumen } from '../../../interfaces/i-klaim-dokumen';
import { Klaim, KlaimResponse, PengajuanService } from '../../../services/pengajuan_klaim/pengajuan.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-dokumen-klaim',
  templateUrl: './dokumen-klaim.component.html',
  styleUrls: ['./dokumen-klaim.component.scss']
})
export class DokumenKlaimComponent implements OnInit {

  claim: Klaim | undefined;
  documents: IKlaimDokumen[] = [];
  filteredDocuments: IKlaimDokumen[] = [];
  isVehicleInsurance: boolean = false;
  isOtherInsurance: boolean = false;
  isUpdating: boolean = false;
  isCustomerLoggedIn:boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn:boolean = UserStorageService.isAdminLoggedIn();
  notes: string = '';
  user:string = UserStorageService.getUserRole();

  formatInsuranceType(type: string): string {
    const formattedTypes: { [key: string]: string } = {
      'asuransiKendaraan': 'Asuransi Kendaraan',
      'creditProtection': 'Credit Protection',
      'personalAccident': 'Personal Accident',
      'carProtection': 'Car Protection'
      // Tambahkan format lain yang diperlukan
    };

    return formattedTypes[type] || type; // Jika tidak ditemukan, tampilkan tipe asli
  }

  formatStatusType(type: number): string {
    const formattedTypes: { [key: number]: string } = {
      1: 'On Progress',
      2: 'In Review',
      3: 'Pending',
      4: 'Approve',
      5: 'Reject'
      // Tambahkan format lain yang diperlukan
    };
  
    return formattedTypes[type] || 'Unknown'; // Default ke 'Unknown' jika tipe tidak ditemukan
  }

  constructor(
    private route: ActivatedRoute,
    private pengajuanService: PengajuanService,
    private router:Router
  ) {}

  ngOnInit() {
    // Mengambil parameter id dari URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClaimDetails(id);  // Memanggil fungsi untuk mengambil data klaim dan dokumen
    }
  }

  loadClaimDetails(id: string) {
    this.pengajuanService.getClaimById(id).subscribe({
      next: (data: KlaimResponse) => {
        this.claim = data.klaim;
        this.documents = Array.isArray(data.dokumen) ? data.dokumen : [];
        this.updateInsuranceType();
        this.filterDocuments();
        console.log(this.claim);
        console.log(this.claim.idKontrak);
      },
      error: (error) => {
        console.error('Error fetching claim details and documents:', error);
      }
    });
  }

  // Mengupdate jenis asuransi untuk menentukan filter dokumen yang sesuai
  updateInsuranceType(): void {
    const produkAsuransi = this.claim?.jenisAsuransi;
    this.isVehicleInsurance = produkAsuransi === 'asuransiKendaraan' || produkAsuransi === 'carProtection';
    this.isOtherInsurance = produkAsuransi === 'creditProtection' || produkAsuransi === 'personalAccident';
  }

  // Memfilter dokumen berdasarkan jenis asuransi
  filterDocuments(): void {
    if (this.isVehicleInsurance) {
      this.filteredDocuments = this.documents.filter(doc => 
        doc.idMasterDoc.jenisDokumen === 'KTP' || doc.idMasterDoc.jenisDokumen === 'STNK' || doc.idMasterDoc.jenisDokumen === 'BPKB');
    } else if (this.isOtherInsurance) {
      this.filteredDocuments = this.documents.filter(doc => 
        doc.idMasterDoc.jenisDokumen === 'KTP' || doc.idMasterDoc.jenisDokumen === 'KK' || doc.idMasterDoc.jenisDokumen === 'SuratKematian');
    } else {
      this.filteredDocuments = this.documents;
    }
  }

  // Fungsi untuk membuka dokumen (misalnya, dengan membuka URL atau menampilkan dokumen)
  openDocument(doc: IKlaimDokumen) {
    // Gantikan "D:" dengan "http://localhost:8080/api" dan hapus ekstensi file
    const formattedUrl = doc.directory
      .replace('D:', 'http://localhost:8080/api')  // Mengganti D: dengan base URL
      .replace(/\.\w+$/, '');  // Menghapus ekstensi file (misalnya .jpeg, .png, dll)
  
    // Buka URL yang telah diformat
    window.open(formattedUrl, '_blank');
  }

  // Mendapatkan dokumen berdasarkan jenis dokumen
  getDocumentsByType(type: string): IKlaimDokumen[] {
    return this.documents.filter(doc => doc.idMasterDoc.jenisDokumen === type);
  }

  proceedClaim() {
    this.isUpdating = true;
  
    this.pengajuanService.updateClaimStatus(this.claim?.id, 1, this.notes).subscribe({
      next: () => {
        if (this.claim) this.claim.status = 1;
        this.isUpdating = false;
  
        // Kirim log aktivitas
        this.pengajuanService.logActivity(
          `Proses klaim untuk ${this.claim?.jenisAsuransi} dengan nomor kontrak ${this.claim?.idKontrak.idKontrak} dan nomor polis ${this.claim?.noPolis}`,
          this.user === "ADMIN" ? "Admin" : "Imanuel"
        ).subscribe();
  
        alert('Klaim berhasil diproses dengan catatan.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isUpdating = false;
        alert('Gagal memproses klaim.');
      }
    });
  }
  
  pendingClaim() {
    this.isUpdating = true;
  
    this.pengajuanService.updateClaimStatus(this.claim?.id, 3, this.notes).subscribe({
      next: () => {
        if (this.claim) this.claim.status = 3;
        this.isUpdating = false;
  
        // Kirim log aktivitas
        this.pengajuanService.logActivity(
          `Pending klaim untuk ${this.claim?.jenisAsuransi} dengan nomor kontrak ${this.claim?.idKontrak.idKontrak} dan nomor polis ${this.claim?.noPolis}`,
          this.user === "ADMIN" ? "Admin" : "Imanuel"
        ).subscribe();
  
        alert('Klaim berhasil dipindahkan ke status Pending.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isUpdating = false;
        alert('Gagal memindahkan klaim.');
      }
    });
  }
  
  approveClaim() {
    this.isUpdating = true;
  
    this.pengajuanService.updateClaimStatus(this.claim?.id, 4, this.notes).subscribe({
      next: () => {
        if (this.claim) this.claim.status = 4;
        this.isUpdating = false;
  
        // Kirim log aktivitas
        this.pengajuanService.logActivity(
          `Persetujuan klaim untuk ${this.claim?.jenisAsuransi} dengan nomor kontrak ${this.claim?.idKontrak.idKontrak} dan nomor polis ${this.claim?.noPolis}`,
          this.user === "ADMIN" ? "Admin" : "Imanuel"
        ).subscribe();
  
        alert('Klaim berhasil disetujui dengan catatan.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isUpdating = false;
        alert('Gagal menyetujui klaim.');
      }
    });
  }
  
  rejectClaim() {
    this.isUpdating = true;
  
    this.pengajuanService.updateClaimStatus(this.claim?.id, 5, this.notes).subscribe({
      next: () => {
        if (this.claim) this.claim.status = 5;
        this.isUpdating = false;
  
        // Kirim log aktivitas
        this.pengajuanService.logActivity(
          `Penolakan klaim untuk ${this.claim?.jenisAsuransi} dengan nomor kontrak ${this.claim?.idKontrak.idKontrak} dan nomor polis ${this.claim?.noPolis}`,
          this.user === "ADMIN" ? "Admin" : "Imanuel"
        ).subscribe();
  
        alert('Klaim berhasil ditolak dengan catatan.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isUpdating = false;
        alert('Gagal menolak klaim.');
      }
    });
  }
  
  
  

}
