import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  templateUrl: './custom-menu.html',
  styleUrl: './custom-menu.css',
})
export class CustomMenuComponent {

  constructor(private router: Router) {
    this.loadFromLocalStorage();
  }

  showCancelModal = false;
  selectedPackages: SelectedItem[] = [];

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
    )
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
    localStorage.removeItem('selectedPackages')
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

  menuSections: MenuSection[] = [
    {
      id: 'Appetizers',
      title: 'Appetizers',
      items: [
        { image: 'assets/freshlumpia.jpg', title: 'Fresh Lumpia', price: '180' },
        { image: 'assets/ukoy1.jpg', title: 'Ukoy', price: '200' },
        { image: 'assets/tokwatbaboy.jpg', title: 'Tokwa at Baboy', price: '150' },
        { image: 'assets/calamares.jpg', title: 'Calamares', price: '280' },
        { image: 'assets/fishball.png', title: 'fish Balls', price: '180' },
        { image: 'assets/chicharonbulaklak.jpg', title: 'Chicharon Bulaklak', price: '240' },
        { image: 'assets/dynamite.jpg', title: 'Dynamite', price: '170' },
        { image: 'assets/lumpiang-shanghai.png', title: 'Lumpiang Shanghai', price: '150' },
      ]
    },
    {
      id: 'Sides',
      title: 'Sides',
      items: [
        { image: 'assets/grice.png', title: 'Garlic Rice', price: '60' },
        { image: 'assets/javarice.jpg', title: 'Java Rice', price: '60' },
        { image: 'assets/steamed rice.jpg', title: 'Steamed Rice', price: '60' },
        { image: 'assets/atchara.jpg', title: 'Atchara', price: '50' },
        { image: 'assets/tofu.jpg', title: 'Fried Tofu', price: '70' },
        { image: 'assets/fishcrackers.jpg', title: 'Fish Crackers', price: '50' },
        { image: 'assets/sideup.jpg', title: 'Fried Egg', price: '50' },
        { image: 'assets/coleslaw.png', title: 'Coleslaw', price: '80' },
      ]
    },
    {
      id: 'Mains',
      title: 'Mains',
      items: [
        { image: 'assets/sisig.png', title: 'Sisig', price: '120' },
        { image: 'assets/caldereta.jpg', title: 'Caldereta', price: '200' },
        { image: 'assets/adobo-pork.jpg', title: 'Pork Adobo', price: '150' },
        { image: 'assets/chickenadobo.jpg', title: 'Chicken Adobo', price: '135' },
        { image: 'assets/bulalo.jpg', title: 'Bulalo', price: '200' },
        { image: 'assets/pakbet.jpg', title: 'Pakbet', price: '100' },
        { image: 'assets/sinigangnahipon.jpg', title: 'Sinigang na hipon', price: '140' },
        { image: 'assets/crispypata.jpg', title: 'Crispy Pata', price: '280' },
      ]
    },
    {
      id: 'Desserts',
      title: 'Desserts',
      items: [
        { image: 'assets/lecheflan.jpg', title: 'Leche Flan', price: '70' },
        { image: 'assets/halo1.png', title: 'Halo-Halo', price: '100' },
        { image: 'assets/bukopandan1.png', title: 'Buko Pandan', price: '100' },
        { image: 'assets/maisconyelo.jpg', title: 'Mais con yelo', price: '100' },
        { image: 'assets/bibingka.jpg', title: 'Bibingka', price: '120' },
        { image: 'assets/majablanca.jpg', title: 'Maja Blanca', price: '100' },
        { image: 'assets/ube champorado.jpg', title: 'Ube Champorado', price: '150' },
        { image: 'assets/turon.jpg', title: 'Turon', price: '60' },
      ]
    },
    {
      id: 'Drinks',
      title: 'Drinks',
      items: [
        { image: 'assets/calamansi juice.jpg', title: 'Calamansi Juice', price: '75' },
        { image: 'assets/buko juice.jpg', title: 'Buko Juice', price: '75' },
        { image: 'assets/sago gulaman.jpg', title: 'Sago at Gulaman', price: '75' },
        { image: 'assets/watermelon juice.jpg', title: 'Watermelon Juice', price: '120' },
      ]
    }
  ];
}