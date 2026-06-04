import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { ResetPass } from '../reset-pass/reset-pass';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [ResetPass, ReactiveFormsModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage implements OnInit {
  search = new FormControl('');

  currentUserId = signal<number>(0);

  mostraResetPass = false;
  idUtenteSelezionato!: number;

  sortKey: keyof User = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  allUsers: User[] = [];

  isLoadeing = false;

  constructor(public userService: UserService, private router: Router,private cd: ChangeDetectorRef) 
  {

  }

  ngOnInit() {
    this.FindCurrentUser();
    this.loadUsers();
  }

  async FindCurrentUser()
  {
    await this.userService.DettagliUtenteAutenticato().subscribe((user) => {
      this.currentUserId.set(user.id);
    }); 
  }

  loadUsers() {
    this.isLoadeing = true;
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
      let risultati = utenti;

      if (this.search.value && this.search.valid && this.search.value.trim() !== '') {
        const termineRicerca = this.search.value.toLowerCase().trim();
        risultati = risultati.filter((user) =>
          user.firstName.toLowerCase().includes(termineRicerca)
        );
      }

      this.allUsers = risultati;

      this.applySort();

      this.cd.detectChanges();
      this.isLoadeing = false;
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
      this.loadUsers();
    });
  }

  resetPassword(user: User) {
    this.idUtenteSelezionato = user.id;
    this.mostraResetPass = true;
  }

  eseguiResetPassword(nuovaPassword: string) {
    this.userService.ResetPassword(this.idUtenteSelezionato.toString(), nuovaPassword).subscribe(() => {
      this.mostraResetPass = false;
    });
  }

  sortBy(key: keyof User) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applySort();
  }

  private applySort() {
    const key = this.sortKey;
    const isAsc = this.sortDirection === 'asc';

    this.allUsers.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });
  }

  searchUsers() {
    this.loadUsers();
  }

  clearSearch() {
    this.search.setValue('');
    this.loadUsers();
  }
}