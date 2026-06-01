import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  loginForm = new FormGroup({
      email : new FormControl('',[Validators.required,Validators.email]),
      password : new FormControl('',[Validators.required])
  })

  

  constructor(private http:HttpClient, private userService: UserService){

  }

  Login(){
    let email= this.loginForm.controls.email.value
    let password= this.loginForm.controls.password.value
    

    this.userService.Login(email, password)
  }
}
