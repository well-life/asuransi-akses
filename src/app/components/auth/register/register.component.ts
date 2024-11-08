import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private message: NzMessageService, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nip: [null, [Validators.required, this.nipValidator]],
      name: [null, [Validators.required, this.nameValidator]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), this.passwordValidator]],
      alamat: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      noHp: [null, [Validators.required, this.phoneNumberValidator]] // ubah dari no_hp ke noHp
    });
  }

  nameValidator(control: AbstractControl) {
    const name = control.value;
    const valid = /^[A-Z][a-zA-Z\s]*$/.test(name);
    return valid ? null : { invalidName: true };
  }

  passwordValidator(control: AbstractControl) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password?.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasMinLength) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  nipValidator(control: AbstractControl) {
    const nip = control.value;
    const valid = /^\d{16,20}$/.test(nip);
    return valid ? null : { invalidNip: true };
  }

  phoneNumberValidator(control: AbstractControl) {
    const phoneNumber = control.value;
    const valid = /^08\d{8,}$/.test(phoneNumber);
    return valid ? null : { invalidPhoneNumber: true };
  }

  submitForm() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(res => {
        if (res.id != null) {
          this.message.success("Signup successful", { nzDuration: 5000 });
          this.router.navigateByUrl('/login');
        } else {
          this.message.error(`${res.message}`, { nzDuration: 5000 });
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message.error("Please complete the form correctly", { nzDuration: 5000 });
    }
  }
}
