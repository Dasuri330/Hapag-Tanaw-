import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertModalComponent } from '../../../../shared/components/modals/alert-modal/alert-modal.component/alert-modal.component';
import { WarningModalComponent } from '../../../../shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { StepperComponent } from '../../../../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-reserve-now',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AlertModalComponent,
    WarningModalComponent,
    StepperComponent
  ],
  templateUrl: './reserve-now.component.html',
  styleUrl: './reserve-now.component.css',
})
export class ReserveNowComponent implements OnInit {
  reservationForm!: FormGroup;
  currentStep = 1;

  guestOptions = [
    '1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests',
    '6 Guests', '7 Guests', '8 Guests', '9 Guests', '10 Guests',
    '10 or more Guests'
  ];

  selectedPeriodStart = 'AM';
  selectedPeriodEnd = 'PM';
  displayTimeRange = '-- : -- -- → -- : -- --';
  timeRangeBorderColor = '#D27D2D';

  hourOptions = ['10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
  minuteOptions = ['00', '15', '30', '45'];

  minDate: string = '';
  showValidationModal = false;
  showTimeValidationModal = false;
  showCancelModal = false;
  timeValidationMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Clear previous reservation data on page load
    localStorage.removeItem('reservationData');

    // Initialize form
    this.reservationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.phoneValidator]],
      date: ['', Validators.required],
      hourStart: ['', Validators.required],
      minuteStart: ['', Validators.required],
      hourEnd: ['', Validators.required],
      minuteEnd: ['', Validators.required],
      numGuests: ['', [Validators.required, Validators.min(1), Validators.max(40)]],
      specialOccasion: ['', Validators.maxLength(100)],
      specialRequests: ['', Validators.maxLength(100)]
    });

    // Set minimum date
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.setupTimeValidation();
  }

  // Custom phone validator
  phoneValidator(control: any) {
    const phonePattern = /^(09\d{9}|\+639\d{9})$/;
    return phonePattern.test(control.value) ? null : { invalidPhone: true };
  }

  setupTimeValidation(): void {
    this.reservationForm.get('hourStart')?.valueChanges.subscribe(() => this.updateTimeDisplay());
    this.reservationForm.get('minuteStart')?.valueChanges.subscribe(() => this.updateTimeDisplay());
    this.reservationForm.get('hourEnd')?.valueChanges.subscribe(() => this.updateTimeDisplay());
    this.reservationForm.get('minuteEnd')?.valueChanges.subscribe(() => this.updateTimeDisplay());
  }


  updateTimeDisplay(): void {
    const hourStart = this.reservationForm.get('hourStart')?.value;
    const minuteStart = this.reservationForm.get('minuteStart')?.value;
    const hourEnd = this.reservationForm.get('hourEnd')?.value;
    const minuteEnd = this.reservationForm.get('minuteEnd')?.value;

    const start = hourStart && minuteStart
      ? `${hourStart}:${minuteStart} ${this.selectedPeriodStart}`
      : '-- : -- --';

    const end = hourEnd && minuteEnd
      ? `${hourEnd}:${minuteEnd} ${this.selectedPeriodEnd}`
      : '-- : -- --';

    this.displayTimeRange = `${start} → ${end}`;

    if (hourStart && minuteStart && hourEnd && minuteEnd) {
      const validation = this.validateTimeRange(
        hourStart, minuteStart, this.selectedPeriodStart,
        hourEnd, minuteEnd, this.selectedPeriodEnd
      );

      if (!validation.valid) {
        this.timeRangeBorderColor = '#dc3545';
        this.showTimeValidationMessage(validation.message);
        if (validation.clearEnd) {
          this.reservationForm.patchValue({ hourEnd: '', minuteEnd: '' });
        }
      } else {
        this.timeRangeBorderColor = '#D27D2D';
      }
    }
  }

  validateTimeRange(
    hStart: string, mStart: string, periodStart: string,
    hEnd: string, mEnd: string, periodEnd: string
  ): { valid: boolean; message: string; clearEnd: boolean } {
    let hs = parseInt(hStart);
    let he = parseInt(hEnd);

    if (periodStart === 'PM' && hs !== 12) hs += 12;
    if (periodStart === 'AM' && hs === 12) hs = 0;
    if (periodEnd === 'PM' && he !== 12) he += 12;
    if (periodEnd === 'AM' && he === 12) he = 0;

    const startMin = hs * 60 + parseInt(mStart);
    const endMin = he * 60 + parseInt(mEnd);

    const minTime = 10 * 60;
    const maxTime = 21 * 60;

    if (startMin < minTime || startMin > maxTime) {
      return { valid: false, message: 'Start time must be between 10:00 AM and 9:00 PM', clearEnd: false };
    }

    if (endMin < minTime || endMin > maxTime) {
      return { valid: false, message: 'End time must be between 10:00 AM and 9:00 PM', clearEnd: true };
    }

    if (endMin <= startMin) {
      return { valid: false, message: 'End time must be after start time', clearEnd: true };
    }

    return { valid: true, message: '', clearEnd: false };
  }

  showTimeValidationMessage(message: string): void {
    this.timeValidationMessage = message;
    this.showTimeValidationModal = true;
  }

  closeTimeValidationModal(): void {
    this.showTimeValidationModal = false;
  }

  selectPeriodStart(period: string): void {
    this.selectedPeriodStart = period;
    this.updateTimeDisplay();
  }

  selectPeriodEnd(period: string): void {
    this.selectedPeriodEnd = period;
    this.updateTimeDisplay();
  }

  onNext(): void {
    // mark field as touched
    Object.keys(this.reservationForm.controls).forEach(key => {
      this.reservationForm.get(key)?.markAsTouched();
    });

    // to check if the form is valid
    if (!this.reservationForm.valid) {
      this.showValidationModal = true;
      return;
    }

    // Determine the final guest count
    let finalGuestCount = this.reservationForm.value.numGuests;
    if (this.reservationForm.value.numGuests === '10 or more Guests') {
      finalGuestCount = `${this.reservationForm.value.specificGuestCount} Guests`;
    }

    const formData = {
      fullName: this.reservationForm.value.fullName,
      email: this.reservationForm.value.email,
      phoneNumber: this.reservationForm.value.phoneNumber,
      date: this.reservationForm.value.date,
      timeStart: `${this.reservationForm.value.hourStart}:${this.reservationForm.value.minuteStart} ${this.selectedPeriodStart}`,
      timeEnd: `${this.reservationForm.value.hourEnd}:${this.reservationForm.value.minuteEnd} ${this.selectedPeriodEnd}`,
      numGuests: finalGuestCount,
      specialOccasion: this.reservationForm.value.specialOccasion || '',
      specialRequests: this.reservationForm.value.specialRequests || ''
    };

    // if the form is valid it will proceed to next page
    localStorage.setItem('reservationData', JSON.stringify(formData));
    this.router.navigate(['/main/secure/reservation/food-package']);
  }

  closeValidationModal(): void {
    this.showValidationModal = false;
  }

  onCancel(): void {
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  confirmCancel(): void {
    this.showCancelModal = false;
    localStorage.removeItem('reservationData');
    this.router.navigate(['/']);
  }
}