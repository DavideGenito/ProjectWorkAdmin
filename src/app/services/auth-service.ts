import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/AuthToken';

/*TODO: Aggiungere tutti gli import necessari*/
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(private http : HttpClient) { }

  login(username:string ,password:string)
  {
    /*TODO: Adattare la chiamata API a quanto previsto dal backend*/
    return this.http.post<AuthToken>(environment.baseBackendUrl + '/auth/login',{ "username":username, "password":password }).pipe(
      tap(t=> this.saveToken(t))
    )
  }

  logout()
  {
    /*TODO: Adattare la chiamata API a quanto previsto dal backend*/
    return this.http.post(environment.baseBackendUrl + '/auth/logout',{}).pipe(
      tap(()=> this.deleteToken())
    )
  }

  private saveToken(token : AuthToken)
  {
    localStorage.setItem('token', token.token);
  }

  private deleteToken()
  {
    localStorage.clear();
  }

  getToken()
  {
    return localStorage.getItem('token');
  }

  isLogged()
  {
    var token = localStorage.getItem('token');
    if( !token ) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }

  getFieldFromToken()
  {
    var token = localStorage.getItem('token');
    if( !token || !this.isLogged() ) return 0;

    const decodedToken = this.jwtHelper.decodeToken(token);
    if( decodedToken && decodedToken.field ) return decodedToken.field;
    return 0;
  }
}
