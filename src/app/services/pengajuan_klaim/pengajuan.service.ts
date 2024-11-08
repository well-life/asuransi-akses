import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PengajuanService {

  private apiUrl = 'http://localhost:8080/api/upload';

  constructor(private http: HttpClient) {}

  uploadInsuranceDocuments(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(error => {
        console.error('Error uploading documents:', error);
        return of(data);
      })
    );
  }
}
