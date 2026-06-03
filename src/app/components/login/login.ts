import { Component } from '@angular/core';
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

  constructor(private userService: UserService, private router: Router) {}

  Login() {
    let email = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;

    this.userService.Login(email, password).subscribe({
      next: () => {
        // Il login è andato a buon fine e il token è salvato: ora puoi navigare sicuro
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Gestisci qui eventuali errori di credenziali (es. mostrare un alert)
        console.error("Errore durante il login:", err);
      }
    });
  }
}