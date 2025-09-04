import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormRegisterComponent } from '../form-register/form-register.component';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { FormLoginComponent } from '../form-login/form-login.component';

@Component({
  selector: 'app-login',
  imports: [FormLoginComponent, FormRegisterComponent, CardModule, TabsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnInit { 


  ngOnInit(): void {
    
  }
  
}
