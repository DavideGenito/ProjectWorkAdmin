import { ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { UserList } from '../../models/UserList';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { ResetPass } from '../reset-pass/reset-pass';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [ResetPass],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {
  mostraResetPass = false;
  idUtenteSelezionato!: number;

  constructor(
    public userService: UserService, 
    private cd: ChangeDetectorRef, 
    public userList: UserList, 
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
      this.userList.UpdateUsers(utenti);
      this.cd.detectChanges();
    });
  }

  createUser() {
    this.router.navigate(['/users/new']);
  }

  editUser(user: User) {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(id: number) {
    this.userService.CancellaUtente(id).subscribe(() => {
      this.userList.deleteUser(id);
      this.cd.detectChanges();
    });
  }

  resetPassword(user: User) {
    this.idUtenteSelezionato = user.id;
    this.mostraResetPass = true;
  }

  eseguiResetPassword(nuovaPassword: string) {
    this.userService.ResetPassword(this.idUtenteSelezionato.toString(), nuovaPassword).subscribe();    
    this.mostraResetPass = false; 
    this.cd.detectChanges();
  }

  updatePage() {
    this.cd.detectChanges();
  }
}