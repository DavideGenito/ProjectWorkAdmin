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

  constructor(private http: HttpClient, private auth: AuthService, private userList: UserList) {
  }

  Login(email: string | null, password: string | null) {
    return this.auth.login(email?.toString() ?? '', password?.toString() ?? '');
  }

  Logout() {
    this.auth.logout().subscribe();
  }

  VisualizzaUtenti() {
    let URL = this.host + `/users`;
    return this.http.get<User[]>(URL);    
  }

  CreaUtente(firstName: string, lastName: string, email: string, credit: number, role: string, password: string) {
    let URL = this.host + `/users`;
    let body = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      credit: credit,
      role: role,
      password: password
    };

    return this.http.post<User>(URL, body);
  }

  ModificaUtente(user: User) {
    let URL = this.host + '/users';
    const body = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      credit: user.credit,
      role: user.role,
      password: user.password
    };
    return this.http.put<User>(URL, body);
  }

  CancellaUtente(id: number) {
    let URL = `${this.host}/users/${id}`;
    return this.http.delete(URL);
  }

  ResetPassword(id: string, nuovaPassword: string) {
    let URL = this.host + '/users/resetPassword';
    let body = { id: id, password: nuovaPassword };

    return this.http.post<User>(URL, body);
  }

  DettagliUtente(id: number) {
    let URL = this.host + `/users/${id}`;
    return this.http.get<User>(URL);
  }
}