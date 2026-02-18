import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WarningModalComponent } from '@shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { InvalidPackageModalComponent } from '@shared/components/modals/invalid-package-modal/invalid-package-modal-component/invalid-package-modal.component';
import { SuccessModalComponent } from '@shared/components/modals/success-modal/success-modal-component/success-modal.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';

interface SelectedItem {
  image: string;
  title: string;
  price: string;
  quantity: number;
}

interface ReservationData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  date?: string;
  timeStart?: string;
  timeEnd?: string;
  numGuests?: string;
  specialOccasion?: string;
  specialRequests?: string;
  foodPackage?: string;
  packagePrice?: string | number;
  paymentMethod?: string;
  referenceNumber?: string;
  selectedItems?: SelectedItem[];
  selectedPackages?: any[];
  totalAmount?: number;
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, WarningModalComponent, InvalidPackageModalComponent, SuccessModalComponent, StepperComponent],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  currentStep = 4;
  isConfirmed = false;

  // customer information
  summaryName = '';
  summaryEmail = '';
  summaryPhone = '';
  summaryGuests = '';
  summaryOccasion = '';
  summaryRequests = '';

  // edit fields
  editName = '';
  editEmail = '';
  editPhone = '';
  editGuests = '';
  editOccasion = '';
  editRequests = '';

  // reservation details
  detailsDate = '';
  detailsTime = '';
  editDate = '';
  editTimeStart = '';
  editTimeEnd = '';

  // food package
  selectedPackage = '';
  packagePrice = '';
  editPackage = '';
  autoPrice = '0';

  // Ala Carte Items
  selectedItems: SelectedItem[] = [];
  isAlaCarteOrder = false;

  // Payment
  paymentMethod = '';
  referenceNumber = '';

  // View/Edit toggles
  showCustomerInfoEdit = false;
  showReservationDetailsEdit = false;
  showFoodPackageEdit = false;
  showCancelModal = false;
  showInvalidPackageModal = false;
  showSuccessModal = false;

  onCancel() {
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  confirmCancel() {
    localStorage.removeItem('reservationData');
    localStorage.removeItem('selectedPackages');
    this.showCancelModal = false;
    this.router.navigate(['/']);
  }

  closeInvalidPackageModal() {
    this.showInvalidPackageModal = false;
  }

  // Package prices
  packagePrices: { [key: string]: number } = {
    'Classic Kamayan': 2500,
    'Deluxe Fiesta': 4500,
    'Premium Celebration': 6800
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadReservationData();
  }

 loadReservationData() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    if (!data) return;

    this.summaryName = data.fullName || '';
    this.summaryEmail = data.email || '';
    this.summaryPhone = data.phoneNumber || '';
    this.summaryGuests = data.numGuests || '';
    this.summaryOccasion = data.specialOccasion || '-';
    this.summaryRequests = data.specialRequests || '-';

    this.detailsDate = data.date || '';
    this.detailsTime = `${data.timeStart || ''} → ${data.timeEnd || ''}`;

    this.selectedPackage = data.foodPackage || '-';

    // Check if order includes À La Carte items
    const hasAlaCarteItems = data.selectedItems && data.selectedItems.length > 0;
    const hasPackages = data.selectedPackages && data.selectedPackages.length > 0;

    if (hasAlaCarteItems) {
      this.isAlaCarteOrder = true;
      this.selectedItems = data.selectedItems!;

      // Combine package price + à la carte total
      const packageTotal = hasPackages ? Number(data.packagePrice) || 0 : 0;
      const alaCarteTotal = data.totalAmount || 0;
      const grandTotal = packageTotal + alaCarteTotal;

      this.packagePrice = `₱ ${this.formatPrice(grandTotal)}`;
    } else {
      this.isAlaCarteOrder = false;
      this.packagePrice = data.packagePrice
        ? `₱ ${this.formatPrice(data.packagePrice)}`
        : '-';
    }

    this.paymentMethod = data.paymentMethod || '-';
    this.referenceNumber = data.referenceNumber || '-';
}

  getItemTotal(item: SelectedItem): number {
    return parseFloat(item.price) * item.quantity;
  }

  editCustomerInfo() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    this.editName = data.fullName || '';
    this.editEmail = data.email || '';
    this.editPhone = data.phoneNumber || '';
    this.editGuests = data.numGuests || '';
    this.editOccasion = data.specialOccasion || '';
    this.editRequests = data.specialRequests || '';

    this.showCustomerInfoEdit = true;
  }

  saveCustomerInfo() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    data.fullName = this.editName;
    data.email = this.editEmail;
    data.phoneNumber = this.editPhone;
    data.numGuests = this.editGuests;
    data.specialOccasion = this.editOccasion;
    data.specialRequests = this.editRequests;

    localStorage.setItem('reservationData', JSON.stringify(data));
    this.loadReservationData();
    this.showCustomerInfoEdit = false;
  }

  cancelEditCustomerInfo() {
    this.showCustomerInfoEdit = false;
  }

  editReservationDetails() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    this.editDate = data.date || '';
    this.editTimeStart = data.timeStart || '';
    this.editTimeEnd = data.timeEnd || '';

    this.showReservationDetailsEdit = true;
  }

  saveReservationDetails() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    data.date = this.editDate;
    data.timeStart = this.editTimeStart;
    data.timeEnd = this.editTimeEnd;

    localStorage.setItem('reservationData', JSON.stringify(data));
    this.loadReservationData();
    this.showReservationDetailsEdit = false;
  }

  cancelEditReservationDetails() {
    this.showReservationDetailsEdit = false;
  }

  editFoodPackage() {
    // If Ala Carte, redirect to custom menu to edit
    if (this.isAlaCarteOrder) {
      this.router.navigate(['/custom-menu']);
      return;
    }

    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    this.editPackage = data.foodPackage || '';
    this.autoPrice = data.packagePrice ? data.packagePrice.toString() : '0';
    this.showFoodPackageEdit = true;
  }

  onPackageInput() {
    const normalized = this.normalizePackageName(this.editPackage);
    this.autoPrice = this.packagePrices[normalized]?.toString() || '0';
  }

  saveFoodPackage() {
    const selected = this.normalizePackageName(this.editPackage);
    if (!this.packagePrices[selected]) {
      this.showInvalidPackageModal = true;
      return;
    }

    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    data.foodPackage = selected;
    data.packagePrice = this.packagePrices[selected];

    localStorage.setItem('reservationData', JSON.stringify(data));
    this.loadReservationData();
    this.showFoodPackageEdit = false;
  }

  cancelEditFoodPackage() {
    this.showFoodPackageEdit = false;
  }

  confirmReservation() {
    const data: ReservationData = JSON.parse(
      localStorage.getItem('reservationData') || '{}'
    );

    if (!data.email) {
      alert('Error: No reservation data found.');
      this.router.navigate(['/reserve']);
      return;
    }

    this.saveReservationToHistory(data);

    // UPDATE: Set currentStep to 5 to turn the stepper green
    this.currentStep = 5;
    this.isConfirmed = true;
    this.showSuccessModal = true;
  }

  private saveReservationToHistory(data: ReservationData) {
    // Get current user from sessionStorage
    const currentUserString = sessionStorage.getItem('currentUser');
    if (!currentUserString) {
      console.error('User not logged in');
      return;
    }

    const currentUser = JSON.parse(currentUserString);

    // Create user-specific reservations key
    const userReservationsKey = `reservations_${currentUser.email}`;

    // Get existing reservations for this user
    const existingReservationsString = localStorage.getItem(userReservationsKey);
    const existingReservations = existingReservationsString
      ? JSON.parse(existingReservationsString)
      : [];

    // Create new reservation object
    const newReservation = {
      id: Date.now().toString(),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      date: data.date,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      numGuests: data.numGuests,
      specialOccasion: data.specialOccasion || '',
      specialRequests: data.specialRequests || '',
      foodPackage: data.foodPackage,
      packagePrice: data.packagePrice,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      selectedItems: data.selectedItems || [],
      totalAmount: data.totalAmount,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    // Add to array
    existingReservations.push(newReservation);

    // Save back to localStorage
    localStorage.setItem(userReservationsKey, JSON.stringify(existingReservations));

    console.log('Reservation saved to history:', newReservation);
    console.log('Total reservations:', existingReservations.length);
  }

  goBack() {
    this.router.navigate(['/main/secure/reservation/payment']);
  }

  goToHome() {
    localStorage.removeItem('reservationData');
    localStorage.removeItem('selectedPackages');
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }

  normalizePackageName(name: string): string {
    return name
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  formatPrice(price: string | number): string {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return num.toLocaleString();
  }
}
