import { Component, OnInit } from '@angular/core';
import { PengajuanService } from '../../services/pengajuan_klaim/pengajuan.service';
import { Klaim } from '../../services/pengajuan_klaim/pengajuan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-pengajuan',
  templateUrl: './history-pengajuan.component.html',
  styleUrls: ['./history-pengajuan.component.scss']
})
export class HistoryPengajuanComponent implements OnInit {
  claims: Klaim[] = [];
  filteredClaims: Klaim[] = [];
  searchTerm: string = '';

  constructor(private pengajuanService: PengajuanService, private router:Router) {}

  ngOnInit(): void {
    this.loadHistoryClaims();
  }

  // Memuat klaim dengan status 4 (Approved) dan 5 (Rejected)
  loadHistoryClaims() {
    this.pengajuanService.getAllClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.filteredClaims = this.filterHistoryClaims(data); // Filter klaim dengan status 4 dan 5
        console.log(this.filteredClaims);
      },
      error: (error) => {
        console.error('Error fetching claims:', error);
      }
    });
  }

  // Fungsi untuk memfilter klaim dengan status 4 (Approved) dan 5 (Rejected)
  filterHistoryClaims(claims: Klaim[]): Klaim[] {
    return claims.filter(claim => claim.status === 4 || claim.status === 5);
  }

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

  getProgressWidth(status: number): string {
    switch (status) {
      case 1: // On Progress
        return '75%'; // 2 dari 4 tahap
      case 2: // In Review
        return '25%'; // 1 dari 4 tahap
      case 3: // Pending
        return '50%'; // 2 dari 4 tahap
      case 4: // Approved
        return '100%'; // Tahap selesai
      case 5: // Reject
        return '100%'; // Tahap selesai
      default:
        return '0%'; // Default jika status tidak valid
    }
  }

  // Menampilkan teks status berdasarkan nilai status
  getStatusText(status: number): string {
    switch (status) {
      case 4:
        return 'Approved';
      case 5:
        return 'Rejected';
      default:
        return 'Unknown Status';
    }
  }

  onSearch() {
    this.filteredClaims = this.claims.filter(claim =>
      ((claim.idCustomer?.namaCustomer?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (claim.jenisAsuransi?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())) && (claim.status === 4 || claim.status === 5)
    );
  }

  openClaimDetailsDialog(claim: Klaim) {
    this.router.navigate(['/klaim', claim.id]);
  }
}
