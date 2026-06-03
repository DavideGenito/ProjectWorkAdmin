import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  imports: [],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile implements OnInit {

  constructor(private service: AdminService, private route: ActivatedRoute) {}
  
  ngOnInit() {
    let idParam = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getUser(idParam);
  }
  
  getUser(idParam: number) {
    console.log(this.service.getUser(idParam));
    return this.service.getUser(idParam);
  }
  
}
