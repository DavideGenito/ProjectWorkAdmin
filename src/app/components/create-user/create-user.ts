import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';
import { ErrorService } from '../../services/error-service';
import { trimMinLengthValidator } from '../../models/trim-min-length.validator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, trimMinLengthValidator(2)]),
    lastName: new FormControl('', [Validators.required, trimMinLengthValidator(2)]),
    email: new FormControl('', [Validators.required, Validators.email, trimMinLengthValidator(5)]),
    credit: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(?:\\.[0-9]{1,2})?$')]),
    role: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8), trimMinLengthValidator(8)]),
  });

  allUsers: User[] = [];
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private errorService: ErrorService
  ) {
    let id = Number.parseInt(this.route.snapshot.params['id']);
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
      this.allUsers = utenti;
    });

    if (id) {
      this.userService.DettagliUtente(id).subscribe((user: User) => {
        this.userForm.controls['password'].clearValidators();
        this.userForm.controls['password'].updateValueAndValidity(); // Aggiorna lo stato del controllo

        this.user = user;

        if (this.user) {
          this.userForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            credit: this.user.credit.toString(),
            role: this.user.role,
            password: this.user.password
          });
        }
      });
    }
  }

  checkEmailAndExecute(email: string, onSuccess: () => void): void {
    if (this.user && this.user.email === email) {
      onSuccess();
      return;
    }

    this.userService.VerificaEmailEsiste(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorService.warn("Attenzione: questa email è già associata a un altro utente.");
        } else {
          onSuccess();
        }
      },
      error: (err) => {
        this.errorService.error("Errore durante la verifica dell'email.");
      }
    });
  }

  createUser() {
    if (this.userForm.valid) {
      const emailInput = this.userForm.value.email?.toString().trim() ?? '';

      this.checkEmailAndExecute(emailInput, () => {
        this.userService.CreaUtente(
          this.userForm.value.firstName?.toString().trim() ?? '',
          this.userForm.value.lastName?.toString().trim() ?? '',
          emailInput,
          Number.parseInt(this.userForm.value.credit?.toString() ?? '0'),
          this.userForm.value.role?.toString() ?? '',
          this.userForm.value.password?.toString().trim() ?? ''
        ).subscribe({
          next: () => {
            this.errorService.success("Utente creato con successo");
            this.router.navigate(['/users']);
          },
          error: (err: HttpErrorResponse) => {
            this.errorService.error(err.error || 'Errore durante la creazione dell\'utente', err.message);
          }
        });
      });
    }
  }

  editUser() {
    if (this.userForm.valid && this.userForm.dirty) {
      const emailInput = this.userForm.value.email?.toString().trim() ?? '';

      this.checkEmailAndExecute(emailInput, () => {
        let newUser = new User(
          this.userForm.value.firstName?.toString().trim() ?? '',
          this.userForm.value.lastName?.toString().trim() ?? '',
          emailInput,
          Number.parseInt(this.userForm.value.credit?.toString() ?? '0'),
          this.userForm.value.role?.toString() ?? '',
          this.userForm.value.password?.toString().trim() ?? ''
        );
        newUser.id = this.user?.id ?? 0;

        this.userService.ModificaUtente(newUser).subscribe({
          next: () => {
            this.errorService.success("Utente modificato con successo");
            this.router.navigate(['/users']);
          },
          error: (err: HttpErrorResponse) => {
            this.errorService.error(err.error || 'Errore durante la modifica dell\'utente', err.message);
          }
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}