import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WarningModalComponent } from '@shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';

interface PaymentMethod {
  id: string;
  image: string;
  title: string;
  description: string;
  disabled: boolean;
  unavailableMessage?: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, WarningModalComponent, StepperComponent],
  templateUrl: './maya.component.html',
  styleUrls: ['./maya.component.css']
})
export class MayaComponent implements OnInit {

  // properties
  currentStep = 3;
  selectedMethod: 'GCash' | 'Maya' = 'Maya';
  referenceNumber: string = '';
  errorMessage: string = '';
  showCancelModal: boolean = false;

  // constructor
  constructor(private router: Router) { }

  // lifecycle hook
  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    data.paymentMethod = 'Maya';
    localStorage.setItem('reservationData', JSON.stringify(data));
  }

  // methods
  onReferenceInput(): void {
    this.referenceNumber = this.referenceNumber
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, 16);

    this.errorMessage = '';
  }

  isValidReference(): boolean {
    return (
      /^[A-Z0-9]{16}$/.test(this.referenceNumber) &&
      /[A-Z]/.test(this.referenceNumber) &&
      /[0-9]/.test(this.referenceNumber)
    );
  }

  submitPayment(): void {
    if (!this.isValidReference()) {
      this.errorMessage = 'Maya reference must be exactly 16 alphanumeric characters.';
      return;
    }

    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    data.referenceNumber = this.referenceNumber;
    data.paymentMethod = 'Maya';

    localStorage.setItem('reservationData', JSON.stringify(data));

    this.router.navigate(['/main/secure/reservation/confirm']);
  }

  goBack(): void {
    this.router.navigate(['/main/secure/reservation/payment']);
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  confirmCancel(): void {
    this.showCancelModal = false;
    localStorage.removeItem('reservationData');
    this.router.navigate(['/']);
  }

  changeMethod(): void {
    this.router.navigate(['/main/secure/reservation/payment']);
  }

}