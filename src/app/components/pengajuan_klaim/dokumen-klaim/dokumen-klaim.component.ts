import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IKlaimAsuransi } from '../../../interfaces/i-klaim-asuransi';
import { IKlaimDokumen } from '../../../interfaces/i-klaim-dokumen';

@Component({
  selector: 'app-dokumen-klaim',
  templateUrl: './dokumen-klaim.component.html',
  styleUrls: ['./dokumen-klaim.component.scss']
})
export class DokumenKlaimComponent implements OnInit {

  claim: IKlaimAsuransi = {
    id: 1,
    customerName: "John Doe",
    claimType: "Kesehatan",
    claimDescription: "Klaim biaya rumah sakit",
    userName: "Agent Smith",
    branchName: "Jakarta Pusat",
    submissionDate: "2023-06-15"
  };

  documents: IKlaimDokumen[] = [
    { id: 1, name: "Formulir Klaim", type: "PDF", url: "https://example.com/form.pdf" },
    { id: 2, name: "Bukti Pembayaran", type: "Image", url: "https://example.com/receipt.jpg" },
    { id: 3, name: "Surat Keterangan Dokter", type: "PDF", url: "https://example.com/doctor_letter.pdf" },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Mengambil parameter id dari URL
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Loading claim details for ID:', id);

    // Anda dapat menggunakan id untuk mengambil data klaim dari API atau service
  }

  openDocument(doc: IKlaimDokumen) {
    window.open(doc.url, '_blank');
  }
}
