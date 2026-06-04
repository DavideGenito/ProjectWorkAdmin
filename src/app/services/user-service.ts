import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  Login(email: string | null, password: string | null) {
    return this.auth.login(email?.toString() ?? '', password?.toString() ?? '');
  }

  Logout() {
    this.auth.logout().subscribe();
  }

  VisualizzaUtenti() {
    let URL = environment.baseBackendUrl + `/users`;
    return this.http.get<User[]>(URL);    
  }

  CreaUtente(firstName: string, lastName: string, email: string, credit: number, role: string, password: string) {
    let URL = environment.baseBackendUrl + `/users`;
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
    let URL = environment.baseBackendUrl + '/users';
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
    let URL = `${environment.baseBackendUrl}/users/${id}`;
    return this.http.delete(URL);
  }

  ResetPassword(id: string, nuovaPassword: string) {
    let URL = environment.baseBackendUrl + '/users/resetPassword';
    let body = { id: id, password: nuovaPassword };

    return this.http.post<User>(URL, body);
  }

  DettagliUtente(id: number) {
    let URL = environment.baseBackendUrl + `/users/${id}`;
    return this.http.get<User>(URL);
  }

  DettagliUtenteAutenticato()
  {
    let URL = environment.baseBackendUrl +'/profile'
    return this.http.get<User>(URL)
  }
}