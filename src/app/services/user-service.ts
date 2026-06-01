import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserList } from '../models/UserList';
import { User } from '../models/User';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  host = `https://pascal2026-434310448117.europe-west12.run.app`;

  public userList = new UserList([]);

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  Login(email: string | null, password: string | null) {
    return this.auth.login(email?.toString() ?? '', password?.toString() ?? '');
  }

  Logout() {
    this.auth.logout().subscribe();
  }

  VisualizzaUtenti() {
    let URL = this.host + `/users`;
    this.http.get<User[]>(URL).subscribe((utenti: User[]) => {
      this.userList.allUser = utenti;
    });
  }

  CreaUtente(firstName: string, lastName: string, email: string, credit: number, role: boolean, password: string) {
    let URL = this.host + `/users`;
    let body = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      credit: credit,
      role: role,
      password: password
    };

    this.http.post<User>(URL, body).subscribe((newUser: User) => {
      this.userList.AddUser(newUser);
    });
  }

  ModificaUtente(user: User) {
    let URL = this.host + '/users';
    const body = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      credit: user.credit,
      role: user.Admin,
      password: user.password
    };
    this.http.put<User>(URL, body).subscribe((updated: User) => {
      this.userList.UpdateUser(updated);
    });
  }

  CancellaUtente(id: number) {
    let URL = `${this.host}/users/${id}`;
    this.http.delete(URL).subscribe(() => {
      this.userList.deleteUser(id);
    });
  }

  ResetPassword(nuovaPassword: string) {
    let URL = this.host + '/users/resetPassword';
    let body = { password: nuovaPassword };

    this.http.post<User>(URL, body).subscribe((updated: User) => {
      this.userList.UpdateUser(updated);
    });
  }
}