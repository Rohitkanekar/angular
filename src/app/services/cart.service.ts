import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight } from '../model/flight';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: Flight[] = [];
  private cartSubject = new BehaviorSubject<Flight[]>([]);

  cart = this.cartSubject.asObservable();

  constructor() { }

  addToCart(flight: Flight) {
    this.cartItems.push(flight);
    this.cartSubject.next(this.cartItems);
  }

  getCartItems(): Flight[] {
    return this.cartItems;
  }

}
