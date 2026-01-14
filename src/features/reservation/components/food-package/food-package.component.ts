import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WarningModalComponent } from "../../../../shared/components/modals/warning-modal/warning-modal-components/warning-modal.component";
import { StepperComponent } from '../../../../shared/components/stepper/stepper.component';
import { FoodPackageService, FoodPackage } from '../../../../shared/components/services/food-package.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-food-package',
  standalone: true,
  imports: [CommonModule, WarningModalComponent, StepperComponent],
  templateUrl: './food-package.component.html',
  styleUrl: './food-package.component.css',
})
export class FoodPackageComponent implements OnInit, OnDestroy {


  currentStep = 2;


  showCancelModal = false;


  selectedPackages: FoodPackage[] = [];


  packages: FoodPackage[] = [];


  isLoading: boolean = true;


  protected packagesSubscription?: Subscription;


  constructor(
    private router: Router,
    private foodPackageService: FoodPackageService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('FoodPackageComponent constructor called');
  }


  ngOnInit(): void {
    console.log('ngOnInit called - Initializing food packages');

    // Subscribe to get food packages from JSON file
    this.packagesSubscription = this.foodPackageService.getFoodPackages()
      .subscribe({

        next: (data) => {
          console.log('Component received packages data:', data);
          console.log('Number of packages:', data.foodPackages.length);

          // Store the fetched packages
          this.packages = data.foodPackages;

          // Load previously selected packages from localStorage
          const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
          if (reservationData.selectedPackages) {
            this.selectedPackages = reservationData.selectedPackages;

            // Mark packages as selected based on saved data
            // This restores the selection state if user comes back
            this.packages.forEach(pkg => {
              pkg.selected = this.selectedPackages.some(sp => sp.title === pkg.title);
            });

            console.log('Restored selected packages:', this.selectedPackages);
          }

          // Hide loading spinner
          this.isLoading = false;

          console.log('✅ Packages loaded successfully');

          // Force Angular to update the view
          this.cdr.detectChanges();
          console.log('✅ Change detection triggered');
        },

        error: (error) => {
          console.error('❌ Error loading food packages:', error);

          // Hide spinner even on error
          this.isLoading = false;

          // Update view
          this.cdr.detectChanges();

          // TODO: Could show error message to user
          // alert('Failed to load packages. Please refresh the page.');
        },

   
        complete: () => {
          console.log('✅ Packages subscription completed');
        }
      });
  }

 
  ngOnDestroy(): void {
    if (this.packagesSubscription) {
      this.packagesSubscription.unsubscribe();
      console.log(' Packages subscription cleaned up');
    }
  }


  togglePackage(pkg: FoodPackage): void {
    console.log('Package clicked:', pkg.title);

    // Special case: À La Carte redirects to custom menu
    if (pkg.title === 'À La Carte') {
      console.log('Navigating to custom menu...');

      // Save current step and package type to localStorage
      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      reservationData.currentStep = this.currentStep;
      reservationData.foodPackage = 'À La Carte';
      localStorage.setItem('reservationData', JSON.stringify(reservationData));

      // Navigate to custom menu builder
      this.router.navigate(['/custom-menu']);
      return;
    }

    // If any regular package is clicked, deselect À La Carte
    const alaCarte = this.packages.find(p => p.title === 'À La Carte');
    if (alaCarte) {
      alaCarte.selected = false;
    }

    // Toggle the clicked package selection
    pkg.selected = !pkg.selected;

    // Update selectedPackages array
    if (pkg.selected) {
      // Add to selected packages
      this.selectedPackages.push(pkg);
      console.log('Package added:', pkg.title);
    } else {
      // Remove from selected packages
      this.selectedPackages = this.selectedPackages.filter(p => p.title !== pkg.title);
      console.log('Package removed:', pkg.title);
    }

    console.log('Currently selected:', this.selectedPackages.map(p => p.title));
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
    // Validation: At least one package must be selected
    if (this.selectedPackages.length === 0) {
      alert('Please select at least one package!');
      return;
    }

    // Get existing reservation data from localStorage
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');

    // Save selected packages information
    reservationData.selectedPackages = this.selectedPackages;
    reservationData.foodPackage = this.selectedPackages.map(p => p.title).join(', ');
    reservationData.packagePrice = this.getTotalPrice();
    reservationData.currentStep = 3; // Move to payment step

    // Save updated data to localStorage
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log('Proceeding to payment...');
    console.log('Selected packages:', this.selectedPackages);
    console.log('Total price:', this.getTotalPrice());

    // Navigate to payment page
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

    console.log('Reservation cancelled');
  }
}

