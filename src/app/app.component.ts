import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarService } from './services/sidebar.service';
import { CommonModule } from '@angular/common';
import { StateManagementService } from './services/state-management.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    public sideBarService: SidebarService,
    private router: Router,
    public stateManagementService: StateManagementService
  ) {}
  title = 'training';
}
