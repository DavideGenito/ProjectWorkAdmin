import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function trimMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Se il campo è vuoto, non validiamo qui (ci pensa l'eventuale Validators.required)
    if (!control.value) {
      return null;
    }

    // Convertiamo in stringa e applichiamo il trim()
    const trimmedValue = control.value.toString().trim();

    // Controlliamo se la lunghezza dopo il trim è inferiore al minimo richiesto
    if (trimmedValue.length < minLength) {
      // Restituiamo l'errore con i dettagli sulla lunghezza attuale e quella richiesta
      return { 
        'trimMinLength': { 
          'requiredLength': minLength, 
          'actualLength': trimmedValue.length 
        } 
      };
    }

    // Se passa il controllo, il valore è valido
    return null;
  };
}