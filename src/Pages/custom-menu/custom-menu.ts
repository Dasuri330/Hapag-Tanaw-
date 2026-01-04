import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  imports: [CommonModule, HttpClientModule],  
  templateUrl: './custom-menu.html',
  styleUrl: './custom-menu.css',
})
export class CustomMenuComponent implements OnInit {  

  showCancelModal = false;
  selectedPackages: SelectedItem[] = [];
  

  menuSections$!: Observable<MenuSection[]>;

  constructor(
    private router: Router,
    private http: HttpClient  
  ) {
    this.loadFromLocalStorage();
  }

 
  ngOnInit(): void {
   
    this.menuSections$ = this.http.get<MenuSection[]>('assets/data/ala-carte.json');
  }

  loadFromLocalStorage(): void {
    const saved = localStorage.getItem('selectedPackages');
    if (saved) {
      try {
        this.selectedPackages = JSON.parse(saved);
      } catch (e) {
        console.error('error loading from localStorage:', e);
        this.selectedPackages = [];
      }
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem(
      'selectedPackages',
      JSON.stringify(this.selectedPackages)
    );
  }

  changeMethod(): void {
    this.router.navigate(['/food-package']);
  }

  onBack(): void {
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
    this.showCancelModal = false;
    this.router.navigate(['/home']);
  }

  proceedToPayment(): void {
    if (this.selectedPackages.length === 0) {
      return;
    }

    // Save to localStorage before navigating
    this.saveToLocalStorage();

    // Update reservation data with ala carte items
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    reservationData.foodPackage = 'Ala Carte';
    reservationData.selectedItems = this.selectedPackages;
    reservationData.totalAmount = this.getTotalAmount();
    reservationData.packagePrice = this.getTotalAmount();

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

 
}