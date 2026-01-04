import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var bootstrap: any;

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
  totalAmount?: number;
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.css']
})
export class ConfirmComponent implements OnInit {
  currentStep = 4;
  isConfirmed = false;

  // customer information
  summaryName = '';
  summaryEmail = '';
  summaryPhone = '';
  summaryDate = '';
  summaryTime = '';
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

  onCancel() {
    this.showCancelModal = true;
  }

  confirmCancel() {
    localStorage.removeItem('reservationData');
    localStorage.removeItem('selectedPackages');

    this.showCancelModal = false;

    const successModalEl = document.getElementById('successModal');
    if (successModalEl) {
      const modalInstance = bootstrap.Modal.getInstance(successModalEl) || new bootstrap.Modal(successModalEl);
      modalInstance.hide();
    }

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 150);
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
    this.summaryDate = data.date || '';
    this.summaryTime = `${data.timeStart || ''} → ${data.timeEnd || ''}`;
    this.summaryGuests = data.numGuests || '';
    this.summaryOccasion = data.specialOccasion || '-';
    this.summaryRequests = data.specialRequests || '-';

    this.detailsDate = data.date || '';
    this.detailsTime = `${data.timeStart || ''} → ${data.timeEnd || ''}`;

    this.selectedPackage = data.foodPackage || '-';

    // Check if Ala Carte order
    if (data.foodPackage === 'Ala Carte' && data.selectedItems) {
      this.isAlaCarteOrder = true;
      this.selectedItems = data.selectedItems;
      this.packagePrice = `₱ ${this.formatPrice(data.totalAmount || 0)}`;
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
      alert('Please enter a valid package name!');
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

    this.isConfirmed = true;

    const confirmationEmailElement = document.getElementById('confirmationEmail');
    if (confirmationEmailElement) {
      confirmationEmailElement.textContent = data.email;
    }

    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }

  goBack() {
    this.router.navigate(['/payment']);
  }

  goToHome() {
    localStorage.removeItem('reservationData');
    localStorage.removeItem('selectedPackages');
    const modalEl = document.getElementById('successModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 150);
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