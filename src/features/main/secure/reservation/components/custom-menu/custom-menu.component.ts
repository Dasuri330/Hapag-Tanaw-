import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WarningModalComponent } from '@shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { AlaCarteService, MenuItem, SelectedItem, MenuSection } from '@shared/components/services/ala-carte.service';
import { Subscription } from 'rxjs';
import { CurrencyFormatPipe } from '@shared/components/pipes/currency-format.pipe';

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [CommonModule, WarningModalComponent, CurrencyFormatPipe],
  templateUrl: './custom-menu.component.html',
  styleUrl: './custom-menu.component.css',
})
export class CustomMenuComponent implements OnInit, OnDestroy {

  // Show or hide cancel modal
  showCancelModal = false;

  // Selected items by the user
  selectedPackages: SelectedItem[] = [];

  // Menu sections from service
  menuSections: MenuSection[] = [];

  // Loading state
  isLoading: boolean = true;

  // For unsubscribing later
  private menuSubscription?: Subscription;

  // Inject needed services
  constructor(
    private router: Router,
    private alaCarteService: AlaCarteService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('CustomMenuComponent constructor called');
  }

  // Runs when component starts
  ngOnInit(): void {
    console.log('ngOnInit called');

    // Clear old data
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');

    // Get menu data
    this.menuSubscription = this.alaCarteService.getAlaCarteMenu()
      .subscribe({
        // When data is received
        next: (data) => {
          this.menuSections = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        // If error happens
        error: (error) => {
          console.error('Error loading menu:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        // When done
        complete: () => {
          console.log('Menu loading finished');
        }
      });
  }

  // Cleanup when leaving page
  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
      console.log('Unsubscribed');
    }
  }

  // Save selected items
  saveToLocalStorage(): void {
    localStorage.setItem('selectedPackages', JSON.stringify(this.selectedPackages));
  }

  // Go back to food package page
  changeMethod(): void {
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    this.router.navigate(['/main/secure/reservation/food-package']);
  }

  // Same as changeMethod
  onBack(): void {
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    this.router.navigate(['/main/secure/reservation/food-package']);
  }

  // Show cancel modal
  onCancel(): void {
    this.showCancelModal = true;
  }

  // Hide cancel modal
  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  // Confirm cancel
  confirmCancel(): void {
    this.selectedPackages = [];
    localStorage.removeItem('selectedPackages');
    localStorage.removeItem('reservationData');
    this.showCancelModal = false;
    this.router.navigate(['/']);
  }

  // Go to payment page
  proceedToPayment(): void {
    if (this.selectedPackages.length === 0) return;

    this.saveToLocalStorage();

    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    reservationData.foodPackage = 'À La Carte';
    reservationData.selectedItems = this.selectedPackages;
    reservationData.totalAmount = this.getTotalAmount();
    reservationData.packagePrice = this.getTotalAmount();
    reservationData.currentStep = 3;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    this.router.navigate(['/main/secure/reservation/payment']);
  }

  // Add or remove item
  toggleItem(item: MenuItem): void {
    const index = this.selectedPackages.findIndex(
      selected => selected.title === item.title
    );

    if (index > -1) {
      this.selectedPackages.splice(index, 1);
    } else {
      this.selectedPackages.push({ ...item, quantity: 1 });
    }

    this.saveToLocalStorage();
  }

  // Check if item is selected
  isSelected(item: MenuItem): boolean {
    return this.selectedPackages.some(
      selected => selected.title === item.title
    );
  }

  // Increase quantity
  incrementQuantity(item: SelectedItem, event: Event): void {
    event.stopPropagation();
    item.quantity++;
    this.saveToLocalStorage();
  }

  // Decrease quantity
  decrementQuantity(item: SelectedItem, event: Event): void {
    event.stopPropagation();
    if (item.quantity > 1) {
      item.quantity--;
      this.saveToLocalStorage();
    }
  }

  // Remove item
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

  // Price of one item
  getItemTotal(item: SelectedItem): number {
    return parseFloat(item.price) * item.quantity;
  }

  // Total of all items
  getTotalAmount(): number {
    return this.selectedPackages.reduce((total, item) => {
      return total + this.getItemTotal(item);
    }, 0);
  }

  // List of selected items
  getSelectedTitles(): string {
    if (this.selectedPackages.length === 0) return '';

    return this.selectedPackages
      .map(item => `${item.title} (x${item.quantity})`)
      .join(', ');
  }

  // Same as getTotalAmount
  getTotalPrice(): number {
    return this.getTotalAmount();
  }
}
