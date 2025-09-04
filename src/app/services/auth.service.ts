import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private userSignal = signal<any>(null); // internal signal

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('loggedInUser');

      if (storedUser && storedUser !== 'undefined') {
        try {
          const parsedUser = JSON.parse(storedUser);
          this.userSignal.set(parsedUser);
        } catch (e) {
          console.error('Invalid user JSON in localStorage:', e);
          localStorage.removeItem('loggedInUser');
        }
      }
    }
  }

  // ✅ Public signal to use in template/components
  user = computed(() => this.userSignal());

  setUser(user: any): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to store user in localStorage:', e);
      }
    }
    this.userSignal.set(user);
  }

  clearUser(): void {
    if (this.isBrowser) {
      localStorage.removeItem('loggedInUser');
    }
    this.userSignal.set(null);
  }

  getCurrentUser(): any {
    return this.userSignal();
  }
}
