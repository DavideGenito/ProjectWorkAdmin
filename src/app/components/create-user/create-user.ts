import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/User';

@Component({
  selector: 'app-create-user',
  imports: [ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    credit: new FormControl('', [Validators.required, Validators.min(0)]),
    role: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  user: User | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    let id = Number.parseInt(this.route.snapshot.params['id']);
    this.userService.VisualizzaUtenti().subscribe((utenti) => {
    });


    if (id) {
      this.userService.DettagliUtente(id).subscribe((user: User) => {
        this.userForm.controls['password'].clearValidators();

        this.user = user;

        if (this.user) {
          this.userForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            credit: this.user.credit.toString(),
            role: this.user.role,
            password: this.user.password
          });
        }
      });
    }
  }

  createUser() {
    if (this.userForm.valid) {
      this.userService.CreaUtente(
        this.userForm.value.firstName?.toString() ?? '',
        this.userForm.value.lastName?.toString() ?? '',
        this.userForm.value.email?.toString() ?? '',
        Number.parseInt(this.userForm.value.credit?.toString() ?? '0'),
        this.userForm.value.role?.toString() ?? '',
        this.userForm.value.password?.toString() ?? ''
      ).subscribe(
        () => this.router.navigate(['/users'])
      );
    }
  }

  editUser() {
    if (this.userForm.valid && this.userForm.dirty) {
      let newUser = new User(
        this.userForm.value.firstName?.toString() ?? '',
        this.userForm.value.lastName?.toString() ?? '',
        this.userForm.value.email?.toString() ?? '',
        Number.parseInt(this.userForm.value.credit?.toString() ?? '0'),
        this.userForm.value.role?.toString() ?? '',
        this.userForm.value.password?.toString() ?? ''
      );
      newUser.id = this.user?.id ?? 0;


      this.userService.ModificaUtente(newUser).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}