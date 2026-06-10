import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service'; 
import { Router } from "@angular/router";
import { UserService } from '../../services/user-service';

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

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private userService: UserService) { }

  Login() {
    let email = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.userService.DettagliUtenteAutenticato().subscribe({
          next: (user) => {
            if(user.role == "Amministrazione") {
              this.router.navigate(['/dashboard']);
            } else {
              this.userService.Logout();
              this.errorMessage = "Accesso negato: non sei un amministratore";
              this.cd.detectChanges();
            }
          }
        })
        
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