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
  templateUrl: './maya.component.html',
  styleUrls: ['./maya.component.css']
})
export class MayaComponent implements OnInit {

  constructor(private router: Router) { }

  currentStep = 3;

  selectedMethod: 'GCash' | 'Maya' = 'Maya';
  referenceNumber: string = '';
  errorMessage: string = '';
  showCancelModal: boolean = false;

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    data.paymentMethod = 'Maya';
    localStorage.setItem('reservationData', JSON.stringify(data));
  }


  onReferenceInput(): void {
    this.referenceNumber = this.referenceNumber
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, 16);

    this.errorMessage = '';
  }


  isValidReference(): boolean {
    return (
      /^[A-Z0-9]{16}$/.test(this.referenceNumber) && /[A-Z]/.test(this.referenceNumber) && /[0-9]/.test(this.referenceNumber)
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


    this.router.navigate(['/confirm']);
  }

  goBack(): void {
    this.router.navigate(['/payment']);
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
