import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WarningModalComponent } from '../../../../shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { StepperComponent } from '../../../../shared/components/stepper/stepper.component';
interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  disabled: boolean;
  route?: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, WarningModalComponent, StepperComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {


  currentStep = 3;


  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit',
      title: 'Credit / Debit Card',
      description: 'Credit/Debit Card (Pay with Visa, MasterCard or AMEX)',
      icon: 'bi bi-credit-card-fill',
      disabled: true
    },
    {
      id: 'gcash',
      title: 'GCash',
      description: 'Quick and Secured mobile payment',
      icon: 'bi bi-wallet2',
      disabled: false,
      route: '/gcash'
    },
    {
      id: 'maya',
      title: 'Maya',
      description: 'Digital Walllet Payment',
      icon: 'bi bi-wallet2',
      disabled: false,
      route: '/maya'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Direct bank Deposit transfer',
      icon: 'bi bi-credit-card-fill',
      disabled: true
    },

  ];

  selectedPaymentMethod: string | null = null;


  showUnavailableModal = false;
  showCancelModal = false;
  unavailableMessage = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadSavedPayment();
  }


  selectPaymentMethod(method: PaymentMethod) {
    if (method.disabled) {
      this.unavailableMessage = `${method.title} is currently unavailable.`;
      this.showUnavailableModal = true;
      return;
    }

    this.selectedPaymentMethod = method.id;

    const reservationData =
      JSON.parse(localStorage.getItem('reservationData') || '{}');

    reservationData.paymentMethod = method.title;

    localStorage.setItem(
      'reservationData',
      JSON.stringify(reservationData)
    );

    if (method.route) {
      this.router.navigate([method.route]);
    }
  }


  loadSavedPayment() {
    const data = JSON.parse(localStorage.getItem('reservationData') || '{}');
    if (data.paymentMethod) {
      const found = this.paymentMethods.find(
        m => m.title === data.paymentMethod
      );
      if (found) this.selectedPaymentMethod = found.id;
    }
  }


  onBack() {
    this.router.navigate(['/food-package']);
  }

  onCancel() {
    this.showCancelModal = true;
  }

  confirmCancel() {
    localStorage.removeItem('reservationData');
    this.router.navigate(['/']);
  }


  closeUnavailableModal() {
    this.showUnavailableModal = false;
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }
}
