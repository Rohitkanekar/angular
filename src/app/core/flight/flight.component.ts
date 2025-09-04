import { Component, computed, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FlightService } from '../../services/flight.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export interface Car {
  id: number,
  name: string,
  prize: number
}

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ReactiveFormsModule, RadioButtonModule, InputTextModule, DatePickerModule, SelectModule, ToastModule],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss',
  providers: [ConfirmationService, MessageService],

})

export class FlightComponent implements OnInit {

  today: Date = new Date();
  form: FormGroup;
  cities = [
    { name: 'Mumbai', value: 0 },
    { name: 'Delhi', value: 1 },
    { name: 'Bangalore', value: 2 },
    { name: 'Chennai', value: 3 },
  ];
  classTypes = [
    { name: 'Economy', value: 0 },
    { name: 'Premium Economy', value: 1 },
    { name: 'Business', value: 2 },
    { name: 'First Class Economy', value: 3 },
  ];
  travellersTypes = [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
  ]

  constructor(
    public flighService: FlightService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {

    this.form = this.fb.group({
      tripType: ['One Way', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      class: ['', Validators.required],
      travelers: ['', Validators.required],
      date: ['', Validators.required],
      returnDate: ['']
    });
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('flightFormData');
    if (storedData) {
      this.form.setValue(JSON.parse(storedData));
    }
    const state = history.state && Object.keys(history.state).length > 0
      ? history.state
      : JSON.parse(localStorage.getItem('flightFormData') || '{}');

    if (state && Object.keys(state).length > 0) {
      this.form.patchValue(state);
    }
  }


  get selectedFromCity(): number {
    return this.form.get('from')?.value;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit() {

    const from = this.form.get('from')?.value;
    const to = this.form.get('to')?.value;

    if (from === to) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid City Selection',
        detail: 'Departure and destination cities must be different. Please choose different cities.',
        life: 3000
      });

      return;
    }

    if (this.form.valid) {
      const flightBookingData = this.form.value;
      const finalFlightBookingData = {
        ...flightBookingData,
        date: flightBookingData.date
          ? this.formatDate(new Date(flightBookingData.date))
          : null,
        returnDate: flightBookingData.returnDate
          ? this.formatDate(new Date(flightBookingData.returnDate))
          : null
      };
      this.router.navigate(['/flight-detail'], { state: this.form.value });
      localStorage.setItem('flightFormData', JSON.stringify(this.form.value));
      console.log('Flight Booking Data', finalFlightBookingData);
    }
    else {
      alert('Same cities are not allowed');
    }
  }
}
