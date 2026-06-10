import { ChangeDetectorRef, Component, OnInit, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { User } from '../../models/User';
import { ErrorService } from '../../services/error-service';
import { AuthService } from '../../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  currentUser : User | any;
  isDarkMode: boolean = false;

  constructor(
    private errorService: ErrorService, 
    private router: Router, 
    private adminService: AdminService, 
    private authService: AuthService, 
    private cd: ChangeDetectorRef
  ) {
    
    effect(() => {
      if (this.authService.isLogged()) {
        this.getUser();
      } else {
        this.currentUser = null;
      }
    });

  }

  ngOnInit() {
    this.initTheme(); 
  }
  
  Logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorService.error('Errore durante il logout', err.message);
      }
    });
  }

  getUser() {
    this.adminService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.currentUser = user;
        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.errorService.error('Errore nel recupero dell\'utente corrente', err.message);
      }
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }
}