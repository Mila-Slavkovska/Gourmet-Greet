import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { AuthenticationRequest } from '../interfaces/auth/authentication-request';
import { LoginResponse } from '../interfaces/auth/login-response';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  loginForm: FormGroup;
  service = inject(AuthService);
  router = inject(Router);
  userService = inject(UserService);
  errorMessage: boolean = false;

  submitted = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const formValue = this.loginForm.value;

    const authRequest: AuthenticationRequest = {
      email: formValue.email,
      password: formValue.password,
    };
    console.log("auth req"+ authRequest.email)
    this.service.login(authRequest).subscribe((response: LoginResponse) => {
      if (response.error) {
        this.errorMessage = true;
        console.log("eror")
      }
      console.log("success")
      if (response.token) {
        this.userService.getUserDetails().subscribe((user) => {
          this.userService.setCurrentUser(user);
          this.router.navigate(['/']);
        });
      }
    });
  }
}
