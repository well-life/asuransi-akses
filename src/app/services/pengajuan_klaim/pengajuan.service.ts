import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IKlaimDokumen } from '../../interfaces/i-klaim-dokumen';

export interface Customer {
  idCustomer: number;
  namaCustomer: string;
  alamat: string;
  noTelepon: string;
  email: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noKtp: string;
}

export interface Kontrak {
  idKontrak: number;
  keterangan: string;
  idCustomer: Customer;
}

export interface Klaim {
  id: number;
  jenisAsuransi: string;
  createdAt: string;
  status: number;
  noPolis: number;
  idCustomer: Customer;
  idKontrak: Kontrak;
  modifiedAt: string;
  description: string;
  notes: string;
}

export interface KlaimResponse {
  klaim: Klaim;
  dokumen: IKlaimDokumen[];
}

@Injectable({
  providedIn: 'root',
})
export class PengajuanService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper function to get headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Function to handle HTTP errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Method for uploading insurance documents
  uploadInsuranceDocuments(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}api/upload`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError('uploadInsuranceDocuments', data))
    );
  }

  // Method to get contract data by number
  getContractData(noContract: number): Observable<any> {
    return this.http.get(`${this.apiUrl}contract/${noContract}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError('getContractData', null))
    );
  }

  // Method to get all claims
  getAllClaims(): Observable<Klaim[]> {
    return this.http.get<Klaim[]>(`${this.apiUrl}api/claims/all`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError('getAllClaims', []))
    );
  }

  // Method to get claim details and documents by ID
  getClaimById(id: string): Observable<KlaimResponse> {
    return this.http.get<KlaimResponse>(`${this.apiUrl}api/claims/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError('getClaimById', undefined))
    );
  }

  // New Method to update claim status
  updateClaimStatus(id: number, newStatus: number, notes: string): Observable<any> {
    const apiUrl = `${this.apiUrl}api/claims/${id}/update-status`;
    const payload = {
      status: newStatus,
      notes: notes  // Menambahkan catatan ke dalam payload
    };
  
    return this.http.patch(apiUrl, payload, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError('updateClaimStatus'))
    );
  }

  updateClaim(formData: FormData, claimId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}api/claims/${claimId}/update`, formData);
  }

  logActivity(aktivitas: string, username: string): Observable<any> {
    const params = new HttpParams()
      .set('aktivitas', aktivitas)
      .set('username', username);
  
    return this.http.post(`${this.apiUrl}api/log`, null, { headers: this.getAuthHeaders(), params })
      .pipe(catchError(this.handleError('logActivity')));
  }
  
}

