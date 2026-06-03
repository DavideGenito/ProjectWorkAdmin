import { ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { UserList } from '../../models/UserList';
import { User } from '../../models/User';

@Component({
  selector: 'app-users-page',
  imports: [],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {
  allUser: User[] = [];

  constructor(public userService: UserService, private cd: ChangeDetectorRef, private userList: UserList) {
  }

  ngOnInit() {
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
      this.userList.UpdateUsers(utenti);
      this.allUser = utenti;
      this.cd.detectChanges();
    });
  }

  createUser() {
    // redirect a page
  }

  editUser(user: User) {
    // redirect a page
  }

  deleteUser(id: number) {
    this.userService.CancellaUtente(id);
    this.cd.detectChanges();
  }

  resetPassword(user: User){
    // redirect a page
  }
}
