import { Component } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { StateManagementService } from '../services/state-management.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  constructor(public sideBarService: SidebarService, public stateManagementService: StateManagementService) {

  }
}
