import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  public isLoggedIn = signal<boolean>(this.getStoredLoginStatus());
  public loggedInUser = signal<any>(this.getStoredUser());

  constructor(private router: Router) {
    this.restoreLoginState();
  }

  loginUser(user: any) {
    this.isLoggedIn.set(true);
    this.loggedInUser.set(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Delay navigation until signals are set
    setTimeout(() => {
      if (user.role === 0) {
        this.router.navigate(['/home']); // Admin
      } else {
        this.router.navigate(['/local-recipes']); // User
      }
    }, 0);
  }


  logoutUser(): void {
    this.isLoggedIn.set(false);
    this.loggedInUser.set(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }

  restoreLoginState() {
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('loggedInUser');

    if (isLogged && user && user !== 'undefined') {
      try {
        const parsedUser = JSON.parse(user);
        this.isLoggedIn.set(true);
        this.loggedInUser.set(parsedUser);
      } catch (e) {
        this.isLoggedIn.set(false);
        this.loggedInUser.set(null);
      }
    } else {
      this.isLoggedIn.set(false);
      this.loggedInUser.set(null);
    }
  }



  getStoredLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'false';
  }

  getStoredUser(): any {
    const userStr = localStorage.getItem('loggedInUser');

    if (!userStr || userStr === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }

  getCurrentUser(): any {
    return this.loggedInUser();
  }
}
