import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injeksi AuthService
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrNip: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        res => {
          console.log(res);
          if (res.userId != null) {
            const user = {
              id: res.userId,
              role: res.userRole
            };

            // Simpan user dan token setelah login berhasil
            UserStorageService.saveUser(user);
            this.authService.saveToken(res.jwt); // Menyimpan token JWT
            this.message.success("Login successful", { nzDuration: 5000 });
            this.router.navigateByUrl('/dashboard');
          }
        },
        error => {
          this.message.error("Bad Credentials", { nzDuration: 5000 });
        }
      );
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message.error("Please complete the form correctly", { nzDuration: 5000 });
    }
  }
}
