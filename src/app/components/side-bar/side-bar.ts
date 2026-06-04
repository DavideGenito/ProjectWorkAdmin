import { ChangeDetectorRef, Component } from '@angular/core';
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
export class SideBar {
  currentUser : User | any;
  constructor(private userService: UserService, private router: Router, private service: AdminService, private cd: ChangeDetectorRef) {}

  Logout() {
    this.userService.Logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.getUser();
  }
  
  getUser() {
    this.service.getCurrentUser().subscribe(
      (user: any) => {
        this.currentUser = user;
        this.cd.detectChanges();
      },
      (err: any) => {
        console.error('Errore nel recupero dell\'utente corrente', err);
      }
    );
  }
}
