import { Component, Inject, OnInit, PLATFORM_ID, computed, effect, signal } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FlightService } from '../services/flight.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StateManagementService } from '../services/state-management.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  cartCount = 0;
  user = signal<any>(null); // ✅ Local signal for template binding
  private isBrowser: boolean;

  constructor(
    public sideBarService: SidebarService,
    private cartService: CartService,
    private flightService: FlightService,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private authService: AuthService,
    public stateManagementService: StateManagementService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // ✅ Sync user signal with authService

    const currentUser = this.authService.user();
    this.user.set(currentUser);
    if (currentUser) {
      this.stateManagementService.loggedInUser.set(currentUser);
    }


    // ✅ Initialize cart count
    this.flightService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // ✅ Restore cart count from localStorage
    const storedCount = localStorage.getItem('cartCount');
    if (storedCount) {
      this.flightService.setCartCount(+storedCount);
    }
  }

  logout(): void {
    if (this.isBrowser) {
      this.authService.clearUser();
      this.stateManagementService.logoutUser();
      console.log('Logout State', this.stateManagementService.isLoggedIn());
    }
  }

  toggleSidebar(): void {
    this.sideBarService.showSidebar = !this.sideBarService.showSidebar;
  }
}
