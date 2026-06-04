import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage = "";

  constructor(private userService: UserService, private router: Router, private cd: ChangeDetectorRef) { }

  Login() {
    let email = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;

    this.userService.Login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status == 401) {
          this.errorMessage = "Credenziali errate";
        } else {
          this.errorMessage = "Errore durante il login: " + err.message;
        }
        this.cd.detectChanges();
      }
    });
  }
}