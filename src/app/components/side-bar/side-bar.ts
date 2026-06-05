import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user-service';
import { AdminService } from '../../services/admin-service';
import { User } from '../../models/User';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  currentUser : User | any;
  isDarkMode: boolean = false;

  constructor(private userService: UserService, private router: Router, private service: AdminService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getUser();
    this.initTheme(); 
  }
  
  Logout() {
    this.userService.Logout();
    this.router.navigate(['/login']);
  }

  getUser() {
    this.service.getCurrentUser().subscribe({
      next: (user:any) => {
        this.currentUser = user;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore nel recupero dell\'utente corrente', err);
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