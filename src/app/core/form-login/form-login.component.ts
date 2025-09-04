import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import CryptoJS from 'crypto-js';
import { StateManagementService } from '../../services/state-management.service';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
  providers: [MessageService]
})
export class FormLoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private stateManagementService: StateManagementService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { identifier, password } = this.loginForm.value;
    const hashedPassword = CryptoJS.MD5(password).toString();

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const matchedUser = users.find((user: any) =>
      (user.email === identifier || user.phone === identifier) &&
      user.password === hashedPassword
    );

    if (matchedUser) {
      // ✅ Update user in both services
      this.authService.setUser(matchedUser);
      this.stateManagementService.loginUser(matchedUser);

      this.messageService.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: `Welcome ${matchedUser.name}`,
        life: 5000
      });

      this.loginForm.reset();

      // ✅ Navigate based on role
      if (matchedUser.role === 0) {
        this.router.navigate(['/home']); // Admin
      } else {
        this.router.navigate(['/local-recipes']); // User
      }

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid email/phone or password',
        life: 5000
      });
    }
  }

  get formControls(): {
  identifier: any;
  password: any;
} {
  return {
    identifier: this.loginForm.get('identifier'),
    password: this.loginForm.get('password')
  };
}

}
