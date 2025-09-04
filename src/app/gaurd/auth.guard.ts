import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { StateManagementService } from '../services/state-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private stateManagementService: StateManagementService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) return false;

    // Refresh login state from localStorage
    this.stateManagementService.restoreLoginState();

    const isLoggedIn = this.stateManagementService.isLoggedIn();
    const user = this.stateManagementService.getCurrentUser();
    const expectedRole = route.data['role'];

    // Block if not logged in or user not found
    if (!isLoggedIn || !user) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Block if role does not match
    if (expectedRole !== undefined && user.role !== expectedRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

}
