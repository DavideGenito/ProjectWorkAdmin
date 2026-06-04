import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css'],
})
export class AdminProfile implements OnInit {
  currentUser : User | any;
  constructor(private service: AdminService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {}
  
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
