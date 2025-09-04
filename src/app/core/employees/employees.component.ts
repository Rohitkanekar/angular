import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { User } from '../../model/user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Car } from '../flight/flight.component';
import { panValidator } from './panCardCustomValidator';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, KeyFilterModule, DatePickerModule, SelectModule, TableModule, CardModule, ConfirmDialogModule, ToastModule, TooltipModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class EmployeesComponent implements OnInit {

  employeeForm!: FormGroup;
  today: Date = new Date();
  allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
  editIndex: number | null = null;
  users: User[] = [];
  selectedLocationType: number | null = null;
  isClearEnabled = false;

  locationTypes = [
    { name: 'Urban', value: 0 },
    { name: 'Rural', value: 1 },
  ];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    // const x = signal(4);
    // const y = signal(5);
    // const z = computed(() => x() + y());
    // console.log(z());
    // x.set(20);
    // console.log(z());

    // const quantity = signal(1);
    // const qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
    // const selectedVehicle = signal<Car>(
    //   {
    //     id: 1,
    //     name: 'BMW',
    //     prize: 2000
    //   }
    // );

    // const cars = signal<Car[]>([]);

    // console.log(quantity());
    // console.log(qtyAvailable());
    // console.log(selectedVehicle());



    this.employeeForm = this.fb.group({
      pan: ['', [Validators.required, panValidator]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      locationType: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[1-9][0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/)]],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      taluka: ['', Validators.required],
      panchayatName: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
    });


    // Display Employee List
    this.employeeService.getEmployee().subscribe({
      next: (data) => {
        this.users = data;
        console.log("Fetched users:", this.users);
        this.sortEmployeesByIdDesc();
      },
      error: (e) => {
        console.error("Error fetching users:", e);
        this.sortEmployeesByIdDesc();
      }
    });

    // Clear form values
    this.employeeForm.valueChanges.subscribe((formValues) => {
      this.isClearEnabled = Object.values(formValues).some(val => {
        // For non-string values (like date), add extra checks
        if (val === null || val === undefined) return false;
        if (typeof val === 'string') return val.trim() !== '';
        return true;
      });
    });

  }

  // Select Location Type
  onLocationChange(event: any): void {
    this.selectedLocationType = event.value;
    if (this.selectedLocationType === 1) {
      this.employeeForm.addControl('taluka', this.fb.control('', Validators.required));
      this.employeeForm.addControl('panchayatName', this.fb.control('', Validators.required));
      this.employeeForm.removeControl('city');
    } else if (this.selectedLocationType === 0) {
      this.employeeForm.addControl('city', this.fb.control('', Validators.required));
      this.employeeForm.removeControl('taluka');
      this.employeeForm.removeControl('panchayatName');
    } else {
      this.employeeForm.removeControl('taluka');
      this.employeeForm.removeControl('panchayatName');
      this.employeeForm.removeControl('city');
    }
  }

  // Submit New Employee Record
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;
      const derivedData = {
        ...employeeData,
        dateOfBirth: employeeData.dateOfBirth
          ? new Date(employeeData.dateOfBirth).toISOString().split('T')[0]
          : null
      };
      const finalData = { ...employeeData, ...derivedData };

      if (this.editIndex !== null) {
        // Edit mode
        finalData.id = this.users[this.editIndex].id;
        this.employeeService.createEmployee(finalData).subscribe({
          next: () => {
            this.users[this.editIndex!] = finalData;
            this.messageService.add({
              severity: 'info',
              summary: 'Updated',
              detail: 'Employee record has been updated successfully',
              life: 3000
            });
            this.editIndex = null;
          },
          error: (e) => {
            console.error("Error updating employee:", e);
          }
        });
      } else {
        // Add new record
        this.employeeService.createEmployee(finalData).subscribe({
          next: (data) => {
            this.users.push(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: 'New employee has been added successfully',
              life: 3000
            });
          },
          error: (e) => {
            console.error("Error adding employee:", e);
          }
        });
      }

      this.employeeForm.reset();
      this.sortEmployeesByIdDesc();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  // Clear form fields
  onClear() {
    this.employeeForm.reset();
    this.isClearEnabled = false;
  }

  sortEmployeesByIdDesc() {
    this.users.sort((a, b) => Number(b.id) - Number(a.id));
  }


  // Edit Current Employee Record
  onEdit(employee: any): void {
    this.editIndex = this.users.findIndex(emp => emp.id === employee.id);
    this.selectedLocationType = employee.locationType;
    this.onLocationChange({ value: employee.locationType });

    const employeeToEdit = {
      ...employee,
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : null
    };

    this.employeeForm.patchValue(employeeToEdit);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }


  // Delete Employee Record
  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== id);
            this.messageService.add({
              severity: 'error',
              summary: 'Deleted',
              detail: 'Employee has been deleted successfully',
              life: 3000
            });
          },
          error: (e) => {
            console.error("Error fetching users:", e);
          }
        });
      },
      reject: () => {

      },
      rejectButtonStyleClass: 'p-button-danger'
    });
  }

  // Check PAN Card Number Length & Make it uppercase
  onPanInput(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.employeeForm.get('pan')?.setValue(input.value, { emitEvent: false });
    if (this.allowedKeys.includes(event.key)) return;
    const panValue = this.employeeForm.get('pan')?.value;
    if (panValue && panValue.length >= 10) {
      event.preventDefault();
    }
  }

  // Check Phone Number Length
  checkPhoneLength(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key)) return;
    const phoneValue = this.employeeForm.get('phone')?.value;
    if (phoneValue && phoneValue.length >= 10) {
      event.preventDefault();
    }
  }

  // Display Error Messages
  get formControls() {
    return {
      firstName: this.employeeForm.get('firstName'),
      lastName: this.employeeForm.get('lastName'),
      phone: this.employeeForm.get('phone'),
      email: this.employeeForm.get('email'),
      pan: this.employeeForm.get('pan'),
      dateOfBirth: this.employeeForm.get('dateOfBirth'),
      pincode: this.employeeForm.get('pincode'),
      address: this.employeeForm.get('address'),
      locationType: this.employeeForm.get('locationType'),
      city: this.employeeForm.get('city'),
      taluka: this.employeeForm.get('taluka'),
      panchayatName: this.employeeForm.get('panchayatName'),
    };
  }

}
