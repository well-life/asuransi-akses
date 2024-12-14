import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numericValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const isValid = /^[0-9]*$/.test(value); // Hanya angka (0-9) yang diperbolehkan
  return isValid ? null : { numeric: true }; // Return error jika tidak valid
}