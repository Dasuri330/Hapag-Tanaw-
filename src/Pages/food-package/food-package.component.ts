import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface FoodPackage {
  title: string;
  persons: string;
  menuItems: string[];
  price: string;
  priceValue?: number;
  image: string;
  imageAlt: string;
  selected?: boolean;
}

@Component({
  selector: 'app-food-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-package.component.html',
  styleUrl: './food-package.component.css',
})
export class FoodPackageComponent implements OnInit {

  currentStep = 2;


  showCancelModal = false;

  selectedPackages: FoodPackage[] = [];

  packages: FoodPackage[] = [
    {
      title: 'Classic Kamayan',
      persons: '4-6 persons',
      menuItems: [
        'Lechon Kawali',
        'Sinigang na Baboy',
        'Grilled Liempo',
        'Garlic Rice',
        'Fresh Lumpia'
      ],
      price: '₱ 2,500',
      priceValue: 2500,
      image: 'assets/Classic Kamayan.png',
      imageAlt: 'Classic Kamayan',
      selected: false
    },
    {
      title: 'Deluxe Fiesta',
      persons: '6-8 persons',
      menuItems: [
        'Crispy Pata',
        'Kare-Kare',
        'Grilled Bangus',
        'Halo-Halo',
        'Leche Flan'
      ],
      price: '₱ 4,500',
      priceValue: 4500,
      image: 'assets/Deluxe Fiesta.png',
      imageAlt: 'Deluxe Fiesta',
      selected: false
    },
    {
      title: 'Premium Celebration',
      persons: '8-10 persons',
      menuItems: [
        'Whole Lechon Belly',
        'Seafood Sinigang',
        'Beef Caldereta',
        'Buttered Shrimp',
        'Buko Pandan'
      ],
      price: '₱ 6,800',
      priceValue: 6800,
      image: 'assets/Premium Celebration.png',
      imageAlt: 'Premium Celebration',
      selected: false
    },
    {
      title: 'À La Carte',
      persons: 'Customizable',
      menuItems: [
        'Build your own menu',
        'Choose from our full selection',
        'Perfect for special preference',
        'Ideal for small or large gatherings',
        'Mix and match your favorite dishes',
        'Great for dietary needs & allergies'
      ],
      price: 'Varies',
      image: 'assets/food-in-table.jpg',
      imageAlt: 'À La Carte',
      selected: false
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Load previously selected packages if any
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    if (reservationData.selectedPackages) {
      this.selectedPackages = reservationData.selectedPackages;
      // Mark packages as selected
      this.packages.forEach(pkg => {
        pkg.selected = this.selectedPackages.some(sp => sp.title === pkg.title);
      });
    }
  }

  togglePackage(pkg: FoodPackage): void {
    // If A La Carte is clicked, navigate to custom menu page
    if (pkg.title === 'À La Carte') {

      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      reservationData.currentStep = this.currentStep;
      reservationData.foodPackage = 'À La Carte';
      localStorage.setItem('reservationData', JSON.stringify(reservationData));

      // Redirect to custom menu page
      this.router.navigate(['/custom-menu']);
      return;
    }


    // If any regular package is clicked, deselect À La Carte
    const alaCarte = this.packages.find(p => p.title === 'À La Carte');
    if (alaCarte) {
      alaCarte.selected = false;
    }

    // Toggle the clicked package
    pkg.selected = !pkg.selected;

    // Update selectedPackages array
    if (pkg.selected) {
      this.selectedPackages.push(pkg);
    } else {
      this.selectedPackages = this.selectedPackages.filter(p => p.title !== pkg.title);
    }
  }

  getSelectedTitles(): string {
    return this.selectedPackages.map(p => p.title).join(', ');
  }

  getTotalPrice(): number {
    return this.selectedPackages.reduce((total, pkg) => {
      return total + (pkg.priceValue || 0);
    }, 0);
  }

  proceedToPayment(): void {
    if (this.selectedPackages.length === 0) {
      alert('Please select at least one package!');
      return;
    }

    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');

    // Save selected packages info
    reservationData.selectedPackages = this.selectedPackages;
    reservationData.foodPackage = this.selectedPackages.map(p => p.title).join(', ');
    reservationData.packagePrice = this.getTotalPrice();
    reservationData.currentStep = 3;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log('Selected packages:', this.selectedPackages);
    console.log('Total price:', this.getTotalPrice());

    this.router.navigate(['/payment']);
  }

  onBack(): void {
    this.router.navigate(['/reserve-now']);
  }

  onCancel(): void {
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  confirmCancel(): void {
    localStorage.removeItem('reservationData');
    this.showCancelModal = false;
    this.router.navigate(['/']);
  }
}