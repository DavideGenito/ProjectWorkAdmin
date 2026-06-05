import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user-service';
import { ResetPass } from '../reset-pass/reset-pass';

@Component({
  selector: 'app-admin-profile',
  imports: [ResetPass],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css'],
})
export class AdminProfile implements OnInit {
  currentUser : User | any;
  mostraResetPass = false;
  
  constructor(private service: AdminService, 
    private route: ActivatedRoute, 
    private cd: ChangeDetectorRef,
    private router:Router,
    private userService:UserService
  ) {

  }
  
  ngOnInit() {
    this.getUser();
  }
  
  getUser() {
    this.service.getCurrentUser().subscribe({
      next: (user: any) => {
        this.currentUser = user;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore nel recupero dell\'utente corrente', err);
      }
    });
  }

  ResetPassword() {
    this.mostraResetPass = true;
  }

  eseguiResetPassword(nuovaPassword: string) {
    this.userService.ResetPassword(this.currentUser.id, nuovaPassword).subscribe(() => {
      this.mostraResetPass = false;
    });
  }
  
  EditProfile(userId:number) {
    this.router.navigate([`users/${userId}/edit`])
  }
}
