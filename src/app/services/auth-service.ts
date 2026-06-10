import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core'; // <--- 1. Importa 'signal'
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthToken } from '../models/AuthToken';
import { ErrorService } from './error-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  private readonly _isLogged = signal<boolean>(false);
  readonly isLogged = this._isLogged.asReadonly();
  
  constructor(private http : HttpClient, private errorService: ErrorService) { 
    this._isLogged.set(this.checkTokenValidity());
  }

  login(email: string, password: string) {
    return this.http.post<AuthToken>(environment.baseBackendUrl + '/auth/login', { "email": email, "password": password }).pipe(
      tap(t => {
        this.saveToken(t);
        this._isLogged.set(true);
      })
    );
  }

  logout() {
    /*TODO: Adattare la chiamata API a quanto previsto dal backend*/
    return this.http.post(environment.baseBackendUrl + '/auth/logout', {}).pipe(
      tap(() => {
        this.deleteToken();
        this._isLogged.set(false); 
      })
    )
  }

  private saveToken(token : AuthToken) {
    localStorage.setItem('token', token.token);
  }

  private deleteToken() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private checkTokenValidity(): boolean {
    var token = this.getToken();
    if (!token || token === 'undefined' || token === 'null') return false;
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      this.errorService.error("Token non valido o scaduto", e instanceof HttpErrorResponse ? e.message : String(e));
      return false;
    }
  }

  getFieldFromToken() {
    var token = this.getToken();
    if( !token || !this.checkTokenValidity() ) return 0;

    const decodedToken = this.jwtHelper.decodeToken(token);
    if( decodedToken && decodedToken.field ) return decodedToken.field;
    return 0;
  }
}