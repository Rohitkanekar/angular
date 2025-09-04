import { Component, OnInit, signal, Signal } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Flight } from '../../model/flight';
import { ButtonModule } from 'primeng/button';
import { IndianNumberPipe } from '../../pipe/indian-number.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-flight-detail',
  imports: [CommonModule, CardModule, ButtonModule, ToastModule, IndianNumberPipe],
  templateUrl: './flight-detail.component.html',
  styleUrl: './flight-detail.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class FlightDetailComponent implements OnInit {

  flights: Flight[] = [];

  constructor(
    public flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    // const flight = this.router.getCurrentNavigation()?.extras.state as Flight;
    // if (flight) {
    //   this.flightService.getFlights(flight).subscribe(data => this.flights = data);
    // }
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const flight = navigation?.extras.state as Flight;

    const stored = localStorage.getItem('flightFormData');
    const searchPayload = flight || (stored ? JSON.parse(stored) : null);

    if (searchPayload) {
      this.flightService.getFlights(searchPayload).subscribe(data => {
        this.flights = data;
      });
    }

    console.log('Booked Flights Data', this.flights);
  }



  book(flight: Flight) {
    this.flightService.bookFlight(flight);
    const formattedDetail = `Booked: ${flight.company}\nFrom: ${flight.from} To: ${flight.to}\nDeparture Date & Time: ${flight.date}, ${flight.time}\n${flight.tripType === 'Round Trip' && flight.returnDate ? `From: ${flight.to} To: ${flight.from}\nReturn Date & Time: ${flight.returnDate}, ${flight.time}\n` : ''}Total: ₹${flight.total}`;
    this.messageService.add({
      severity: 'success',
      summary: 'Flight Booked',
      data: flight,
      detail: formattedDetail,
      life: 3000,
    });
  }

  goBack() {
    this.router.navigate(['/flight']);
  }


}