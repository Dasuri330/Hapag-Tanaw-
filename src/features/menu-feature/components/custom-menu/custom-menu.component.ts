import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WarningModalComponent } from '../../../../shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';

import { Observable } from 'rxjs';

export interface MenuItem {
  image: string;
  title: string;
  price: string;
}

export interface SelectedItem extends MenuItem {
  quantity: number;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule, WarningModalComponent],
  templateUrl: './custom-menu.component.html',
  styleUrl: './custom-menu.component.css',
})
export class CustomMenuComponent implements OnInit {

  showCancelModal = false;
  selectedPackages: SelectedItem[] = [];

  menuSections$!: Observable<MenuSection[]>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    // Clear selections when page loads/refreshes
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');

    // Load menu data
    this.menuSections$ = this.http.get<MenuSection[]>('data/ala-carte.json');
  }

  saveToLocalStorage(): void {
    localStorage.setItem(
      'selectedPackages',
      JSON.stringify(this.selectedPackages)
    );
  }

  changeMethod(): void {
    // Clear selections before going back
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    this.router.navigate(['/food-package']);
  }

  onBack(): void {
    // Clear selections before going back
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    this.router.navigate(['/food-package']);
  }

  onCancel(): void {
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  confirmCancel(): void {
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    localStorage.removeItem('reservationData');
    this.showCancelModal = false;
    this.router.navigate(['/']);
  }

  proceedToPayment(): void {
    if (this.selectedPackages.length === 0) {
      return;
    }

    // Save to localStorage before navigating
    this.saveToLocalStorage();

    // Update reservation data with ala carte items
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    reservationData.foodPackage = 'À La Carte';
    reservationData.selectedItems = this.selectedPackages;
    reservationData.totalAmount = this.getTotalAmount();
    reservationData.packagePrice = this.getTotalAmount();
    reservationData.currentStep = 3;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    this.router.navigate(['/payment']);
  }

  toggleItem(item: MenuItem): void {
    const index = this.selectedPackages.findIndex(
      selected => selected.title === item.title
    );

    if (index > -1) {
      // Remove item completely if already selected
      this.selectedPackages.splice(index, 1);
    } else {
      // Add item with quantity 1
      this.selectedPackages.push({
        ...item,
        quantity: 1
      });
    }
    this.saveToLocalStorage();
  }

  isSelected(item: MenuItem): boolean {
    return this.selectedPackages.some(
      selected => selected.title === item.title
    );
  }

  incrementQuantity(item: SelectedItem, event: Event): void {
    event.stopPropagation();
    item.quantity++;
    this.saveToLocalStorage();
  }

  decrementQuantity(item: SelectedItem, event: Event): void {
    event.stopPropagation();
    if (item.quantity > 1) {
      item.quantity--;
      this.saveToLocalStorage();
    }
  }

  removeItem(item: SelectedItem, event: Event): void {
    event.stopPropagation();
    const index = this.selectedPackages.findIndex(
      selected => selected.title === item.title
    );
    if (index > -1) {
      this.selectedPackages.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  getItemTotal(item: SelectedItem): number {
    return parseFloat(item.price) * item.quantity;
  }

  getTotalAmount(): number {
    return this.selectedPackages.reduce((total, item) => {
      return total + this.getItemTotal(item);
    }, 0);
  }

  // NEW METHODS - Similar to food-package component
  getSelectedTitles(): string {
    if (this.selectedPackages.length === 0) {
      return '';
    }

    // Format: "Item 1 (x2), Item 2 (x1), Item 3 (x3)"
    return this.selectedPackages
      .map(item => `${item.title} (x${item.quantity})`)
      .join(', ');
  }

  getTotalPrice(): number {
    return this.getTotalAmount();
  }
}