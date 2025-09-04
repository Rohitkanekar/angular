import { AbstractControl, ValidationErrors } from '@angular/forms';

export function panValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toUpperCase();

  // If empty, skip validation — let required validator handle it
  if (!value) {
    return null;
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(value) ? null : { invalidPAN: true };
}
