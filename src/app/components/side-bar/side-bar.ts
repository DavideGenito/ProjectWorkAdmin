import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  constructor(private userService: UserService, private router: Router) {}

  Logout() {
    this.userService.Logout();
    this.router.navigate(['/login']);
    
  }
}
