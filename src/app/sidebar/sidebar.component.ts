import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { StateManagementService } from '../services/state-management.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  
  constructor(public sideBarService : SidebarService, public stateManagementService: StateManagementService){
  
    }
  
    ngOnInit(): void {
      
    }
}
