import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PengajuanService } from '../../../services/pengajuan_klaim/pengajuan.service';
import { Klaim } from '../../../services/pengajuan_klaim/pengajuan.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  claims: Klaim[] = [];
  filteredClaims: Klaim[] = [];
  paginatedClaims: Klaim[] = [];
  currentPage: number = 1; // Halaman saat ini
  itemsPerPage: number = 5; // Jumlah item per halaman
  totalItems: number = 0; // Total klaim yang ada (dari backend)
  searchTerm:string = '';

  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  formatInsuranceType(type: string): string {
    const formattedTypes: { [key: string]: string } = {
      'asuransiKendaraan': 'Asuransi Kendaraan',
      'creditProtection': 'Credit Protection',
      'personalAccident': 'Personal Accident',
      'carProtection': 'Car Protection'
    };

    return formattedTypes[type] || type; // Jika tidak ditemukan, tampilkan tipe asli
  }

  constructor(
    private router: Router,
    private pengajuanService: PengajuanService
  ) {}

  ngOnInit() {
    this.loadClaims(); // Memanggil API untuk memuat klaim
  }

  loadClaims() {
    this.pengajuanService.getAllClaims().subscribe({
      next: (data) => {
        this.claims = data; // Dapatkan semua klaim dari API
        this.filterClaimsBasedOnUserRole(); // Filter klaim berdasarkan peran user (admin atau user biasa)
        this.updatePagination(); // Memperbarui pagination setelah klaim dimuat
      },
      error: (error) => {
        console.error('Error fetching claims:', error);
      }
    });
  }

  filterClaimsBasedOnUserRole() {
    if (this.isAdminLoggedIn) {
      // Admin hanya melihat klaim dengan status 1-3 (Tidak melihat status 4 dan 5)
      this.filteredClaims = this.claims.filter(claim => claim.status >= 1 && claim.status <= 3);
    } else {
      // User biasa melihat semua klaim
      this.filteredClaims = [...this.claims];
    }

    // Update totalItems setelah filter
    this.totalItems = this.filteredClaims.length;
    this.updatePagination(); // Memperbarui pagination setelah filter
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Update paginatedClaims hanya dengan data yang sesuai dengan halaman saat ini
    this.paginatedClaims = this.filteredClaims.slice(startIndex, endIndex);
  
    console.log('Filtered Claims:', this.filteredClaims); // Debugging step
    console.log('Paginated Claims:', this.paginatedClaims); // Debugging step
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination(); // Memperbarui klaim yang ditampilkan setelah halaman berubah
    }
  }

  get totalPages(): number {
    // Menghitung jumlah total halaman berdasarkan klaim yang sudah difilter
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onSearch() {
    // Filter klaim sesuai dengan peran pengguna dan kata kunci pencarian
    if (this.isCustomerLoggedIn) {
      this.filteredClaims = this.claims.filter(claim =>
        (claim.idCustomer?.namaCustomer?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
        (claim.jenisAsuransi?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
      );
    } else if (this.isAdminLoggedIn) {
      this.filteredClaims = this.claims.filter(claim =>
        ((claim.idCustomer?.namaCustomer?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
        (claim.jenisAsuransi?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())) && (claim.status !== 4 && claim.status !== 5)
      );
    }
  
    // Update jumlah item setelah filter
    this.totalItems = this.filteredClaims.length;
  
    // Reset halaman ke 1 jika pencarian dilakukan
    this.currentPage = 1;
  
    // Memperbarui klaim yang ditampilkan berdasarkan pagination
    this.updatePagination();
  }
  

  openAddClaimDialog() {
    this.router.navigateByUrl('/form_pengajuan');
  }

  shouldOpenClaimDetails(claim: any): boolean {
    return this.isAdminLoggedIn || claim.status === 4 || claim.status === 5;
  }

  openClaimDetailsDialog(claim: Klaim) {
    this.router.navigate(['/klaim', claim.id]);
  }

  openEditClaimDialog(claimId: string): void {
    this.router.navigate([`/edit-claim/${claimId}`]);  // Arahkan ke halaman edit klaim
  }

  getProgressWidth(status: number): string {
    switch (status) {
      case 1: return '75%'; // On Progress
      case 2: return '25%'; // In Review
      case 3: return '50%'; // Pending
      case 4: return '100%'; // Approved
      case 5: return '100%'; // Rejected
      default: return '0%';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'On Progress';
      case 2: return 'In Review';
      case 3: return 'Pending';
      case 4: return 'Approved';
      case 5: return 'Rejected';
      default: return 'Unknown Status';
    }
  }
}
