import { ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  users: User[] = [];

  constructor(
    private userService: UserService, 
    private adminService: AdminService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  numberUsers: number = 0;
  recentUsers: any[] = [];

  getAllUsers() {
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
      this.users = utenti;
      utenti.sort((a, b) => b.id - a.id).slice(0, 3).forEach((user) => {
        this.recentUsers.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        })
      })
      this.numberUsers = utenti.length;
      this.cd.detectChanges();
    });
  }

  getTodayReservation() {
    this.adminService.getBookings(Date.now().toString(), Date.now().toString()).subscribe((res) => {
      console.log(res);
    });
  }
}
