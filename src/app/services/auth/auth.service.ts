import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Menyimpan token ke localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token); // Menyimpan token JWT di localStorage
  }

  // Mengambil token dari localStorage
  getToken(): string | null {
    return localStorage.getItem('jwtToken'); // Mengambil token dari localStorage
  }

  // Menghapus token dari localStorage (misalnya saat logout)
  removeToken(): void {
    localStorage.removeItem('jwtToken'); // Menghapus token dari localStorage
  }

  // Fungsi registrasi pengguna
  register(signupRequest: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/auth/signup`, signupRequest);
  }

  // Fungsi login
  login(loginRequest: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/auth/login`, loginRequest);
  }
}
