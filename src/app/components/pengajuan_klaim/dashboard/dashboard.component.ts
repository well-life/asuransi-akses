import { Component, OnInit } from '@angular/core';
import { IKlaimAsuransi } from '../../../interfaces/i-klaim-asuransi';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  claims: IKlaimAsuransi[] = [
    {
      id: 1,
      customerName: "John Doe",
      claimType: "Credit Protection",
      claimDescription: "Klaim Pelunasan Pokok Hutang",
      userName: "Agent Smith",
      branchName: "Jakarta Pusat",
      submissionDate: "2023-06-15"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      claimType: "Kendaraan",
      claimDescription: "Klaim kerusakan mobil",
      userName: "Agent Johnson",
      branchName: "Surabaya",
      submissionDate: "2023-06-16"
    },
  ];

  filteredClaims: IKlaimAsuransi[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredClaims = this.claims;
  }

  onSearch() {
    this.filteredClaims = this.claims.filter(claim =>
      claim.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      claim.claimType.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddClaimDialog() {
    this.router.navigateByUrl('/form_pengajuan');
  }

  openClaimDetailsDialog(claim: IKlaimAsuransi) {
    this.router.navigate(['/klaim', claim.id]);
  }
}
