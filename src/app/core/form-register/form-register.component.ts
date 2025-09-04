import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import CryptoJS from 'crypto-js';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-form-register',
  providers: [MessageService],
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, CommonModule, TabsModule, SelectModule, ToastModule, RadioButtonModule],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.scss',
  standalone: true
})
export class FormRegisterComponent implements OnInit {

  registerForm!: FormGroup;
  allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
  roles = [
    { name: 'Admin', value: 0 },
    { name: 'User', value: 1 },
  ];
  roleType: string | undefined;
  captchaQuestion: string = '';
  correctAnswer: number = 0;
  captchaError: boolean = false;
  countdown: number = 0;
  showTimer: boolean = false;
  captchaVerified: boolean = false;

  private countdownInterval: any;

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/)]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[1-9][0-9]{9}$/)]],
      role: ['', Validators.required],
      captchaInput: ['', Validators.required]
    });
    this.generateMathCaptcha();
    //this.refreshCaptcha();
  }

  onRegisterSubmit() {
    this.captchaError = false;

    if (this.registerForm.valid) {
      const formRaw = this.registerForm.getRawValue();
      const enteredAnswer = Number(formRaw.captchaInput);

      if (enteredAnswer !== this.correctAnswer) {
        this.captchaError = true;
        this.refreshCaptcha();
        return;
      }

      const hashedPassword = CryptoJS.MD5(formRaw.password).toString();

      const newUser = {
        ...formRaw,
        password: hashedPassword
      };

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const duplicate = users.find((u: any) => u.email === newUser.email || u.phone === newUser.phone);

      if (duplicate) {
        this.messageService.add({
          severity: 'error',
          summary: 'User Already Exists',
          detail: 'An account with this email or phone already exists'
        });
        return;
      }

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'New user registered successfully'
      });

      this.registerForm.reset();
      this.refreshCaptcha();
      console.log('Register Values', formRaw);
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }


  onRoleChange(event: any): void {
    this.roleType = event.value;
  }

  checkPhoneLength(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key)) return;

    const isDigit = /^[0-9]$/.test(event.key);
    const phoneValue = this.registerForm.get('phone')?.value || '';
    if (!isDigit || phoneValue.length >= 10) {
      event.preventDefault();
    }
  }

  generateMathCaptcha(): void {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const isAddition = Math.random() < 0.5;

    if (isAddition) {
      this.captchaQuestion = `${num1} + ${num2}`;
      this.correctAnswer = num1 + num2;
    } else {
      this.captchaQuestion = `${num1} - ${num2}`;
      this.correctAnswer = num1 - num2;
    }
  }


  refreshCaptcha(): void {
    this.showTimer = true;
    this.countdown = 10;

    this.generateMathCaptcha();

    const captchaControl = this.registerForm.get('captchaInput');
    captchaControl?.reset();
    captchaControl?.enable();
    this.captchaError = false;

    clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.showTimer = false;
      }
    }, 1000);
  }

  validateCaptcha(): void {
    const captchaInput = this.registerForm.get('captchaInput')?.value;

    if (captchaInput && Number(captchaInput) === this.correctAnswer) {
      this.registerForm.get('captchaInput')?.disable();
      this.captchaError = false;
      this.captchaVerified = true;
    } else {
      this.captchaError = !!captchaInput && Number(captchaInput) !== this.correctAnswer;
      this.captchaVerified = false;
    }
  }


  get formControls() {
    return {
      name: this.registerForm.get('name'),
      email: this.registerForm.get('email'),
      password: this.registerForm.get('password'),
      phone: this.registerForm.get('phone'),
      role: this.registerForm.get('role'),
      captchaInput: this.registerForm.get('captchaInput')
    };
  }
}