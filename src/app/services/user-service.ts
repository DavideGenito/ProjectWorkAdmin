import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserList } from '../models/UserList';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  host = `https://pascal2026-434310448117.europe-west12.run.app`

  constructor(private http:HttpClient, private userList: UserList) {

  }

  Login(email:string | null, password:string | null)
  {
    let URL = this.host + `/auth/login`
    let body = {
      email: email,
      password: password
    }
    this.http.post(URL, body).subscribe()
  }

  Logout()
  {
    let URL = this.host + `/auth/logout`
    this.http.post(URL, {}).subscribe()
  }

  VisualizzaUtenti()
  {
    let URL = this.host + `/users`
    this.http.get<UserList>(URL)
  }

  CreaUtente(firstName:string, lastName:string, email:string,credit:number,role:boolean,password:string)
  {
    let URL = this.host + `/users`
    let body = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      credit: credit,
      role: role,
      password: password
    }

    this.http.post<User>(URL, body)
      .subscribe((newUser: User) => {
        this.userList.AddUser(newUser)
      })
  }

  ModificaUtente(user:User)
  {
    let URL = this.host + '/users'
    const body = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      credit: user.credit,
      role: user.Admin,
      password: user.password
    }
    this.http.put<User>(URL, body).subscribe((updated: User) => {
        this.userList.UpdateUser(updated)
      })
  }

  CancellaUtente(id:number)
  {
    let URL = `${this.host}/users/${id}`
    this.http.delete(URL)
    this.userList.deleteUser(id)
  }

  ResetPassword(nuovaPassword:string)
  {
    let URL = this.host + '/users/resetPassword'
    let body = {
      password: nuovaPassword
    }

    this.http.post<User>(URL, body).subscribe((updated: User) => {
        this.userList.UpdateUser(updated)
      })
  }
}

