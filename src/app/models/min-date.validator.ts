import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const min = new Date(minDate);
    
    inputDate.setHours(0, 0, 0, 0);
    min.setHours(0, 0, 0, 0);

    return inputDate >= min ? null : { minDate: { required: min, actual: inputDate } };
  };
}