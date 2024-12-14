import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = UserStorageService.getUser();

    // Jika sudah ada user (sudah login), arahkan ke dashboard atau halaman lain
    if (user) {
      this.router.navigate(['/dashboard']); // atau halaman yang sesuai
      return false;
    }

    // Jika tidak ada user, biarkan akses ke halaman login
    return true;
  }
}
