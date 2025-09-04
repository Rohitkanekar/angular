import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Flight } from '../model/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  public companies = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara'];
  public times = ['06:00 AM', '09:30 AM', '01:45 PM', '06:15 PM'];

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  private bookedFlight: Flight | null = null;

  constructor() {
    const savedCount = localStorage.getItem('cartCount');
    this.cartCount.next(savedCount ? +savedCount : 0);
  }

  getFlights(flight: Flight): Observable<Flight[]> {
    const isReturn = flight.tripType === 'Round Trip';
    const classBasePrices: Record<string, number> = {
      'Economy': 2500,
      'Premium Economy': 4000,
      'Business': 6000,
      'First Class Economy': 8000
    };
    const baseClassPrice = classBasePrices[flight.class] || 2500;
    const flights: Flight[] = this.companies.map((company, i) => {
      const price = baseClassPrice + (i * 300);
      const taxes = price * 0.18;
      const totalPerTraveler = price + taxes;
      const total = isReturn ? totalPerTraveler * 2 * flight.travelers : totalPerTraveler * flight.travelers;

      return {
        ...flight,
        company,
        time: this.times[i],
        price,
        taxes,
        total,
      };
    });

    return of(flights);
  }


  bookFlight(flight: Flight) {
    this.bookedFlight = flight;
    localStorage.setItem('bookedFlight', JSON.stringify(flight));
    const newCount = this.cartCount.value + 1;
    this.cartCount.next(newCount);
    localStorage.setItem('cartCount', newCount.toString());
  }

  getBookedFlight(): Flight | null {
    return this.bookedFlight;
  }

  setCartCount(count: number) {
    this.cartCount.next(count);
    localStorage.setItem('cartCount', count.toString());
  }
}
