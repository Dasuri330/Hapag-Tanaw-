import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './gcash.html',
  styleUrls: ['./gcash.css']
})
export class GcashComponent implements OnInit {

  constructor(private router: Router) { }

  currentStep = 3;

  selectedMethod: 'GCash' | 'Maya' = 'GCash';
  referenceNumber: string = '';
  errorMessage: string = '';
  showCancelModal: boolean = false;

  ngOnInit(): void {

    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    data.paymentMethod = 'GCash';
    localStorage.setItem('reservationData', JSON.stringify(data));
  }


  onReferenceInput(): void {
    // GCash = 13 digits 
    this.referenceNumber = this.referenceNumber
      .replace(/\D/g, '')
      .slice(0, 13);
  }


  isValidReference(): boolean {
    return /^\d{13}$/.test(this.referenceNumber);
  }

  submitPayment(): void {
    if (!this.isValidReference()) {
      this.errorMessage = 'GCash reference must be exactly 13 digits.';
      return;
    }

    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    data.referenceNumber = this.referenceNumber;
    data.paymentMethod = 'GCash';

    localStorage.setItem('reservationData', JSON.stringify(data));


    this.router.navigate(['/confirm']);
  }

  goBack(): void {
    this.router.navigate(['payment']);
  }

  confirmCancel(): void {
    localStorage.removeItem('reservationData');
    this.router.navigate(['/']);
  }

  changeMethod(): void {
    // Go back to payment selection
    this.router.navigate(['/payment']);
  }
}
