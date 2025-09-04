import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CardModule, InputTextModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class Home {

  constructor(private router: Router) { }

  public isDone = true;
  public boxVal = 6000;
  public myData = [
    {
      id: 1,
      name: 'Rohit',
      designation: 'UI Developer',
      isAssigned: false
    },
    {
      id: 2,
      name: 'Reva',
      designation: 'Frontend Developer',
      isAssigned: true
    },
    {
      id: 3,
      name: 'Rico',
      designation: 'UI Developer',
      isAssigned: false
    },
    {
      id: 4,
      name: 'Reene',
      designation: 'Frontend Developer',
      isAssigned: true
    }
  ];

  goToRecipes(event: any) {
    this.router.navigateByUrl('/recipes');
  }

  goToEmployees(event: any) {
    this.router.navigateByUrl('/employees');
  }
}
