import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WarningModalComponent } from "../../../../shared/components/modals/warning-modal/warning-modal-components/warning-modal.component";
import { StepperComponent } from '../../../../shared/components/stepper/stepper.component';
import { FoodPackageService, FoodPackage } from '../../../../shared/components/services/food-package.service';
import { Subscription } from 'rxjs';

/**
 * FoodPackageComponent - Handles food package selection
 * 
 * Features:
 * - Fetches packages from JSON file via service
 * - Display available food packages
 * - Allow multi-selection of packages
 * - Calculate total price
 * - Handle À La Carte navigation
 * - Save selections to localStorage
 * - Show cancel confirmation modal
 */
@Component({
  selector: 'app-food-package',
  standalone: true,
  imports: [CommonModule, WarningModalComponent, StepperComponent],
  templateUrl: './food-package.component.html',
  styleUrl: './food-package.component.css',
})
export class FoodPackageComponent implements OnInit, OnDestroy {

  // ==================== COMPONENT STATE ====================

  /**
   * Current step in the reservation process
   * Used by stepper component to show progress
   */
  currentStep = 2;

  /**
   * Flag to control cancel confirmation modal visibility
   */
  showCancelModal = false;

  /**
   * Array of packages selected by the user
   */
  selectedPackages: FoodPackage[] = [];

  /**
   * Array of all available food packages
   * Loaded from JSON file via service
   */
  packages: FoodPackage[] = [];

  /**
   * Loading state flag
   * true = show spinner, false = show content
   */
  isLoading: boolean = true;

  /**
   * Subscription to the packages observable
   * Stored for cleanup in ngOnDestroy
   */
  private packagesSubscription?: Subscription;

  // ==================== CONSTRUCTOR ====================

  /**
   * Constructor - Dependency Injection
   * 
   * @param router - Router service for navigation
   * @param foodPackageService - Service for fetching food packages from JSON
   * @param cdr - ChangeDetectorRef for manual change detection
   */
  constructor(
    private router: Router,
    private foodPackageService: FoodPackageService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('FoodPackageComponent constructor called');
  }

  // ==================== LIFECYCLE HOOK: ngOnInit ====================

  /**
   * ngOnInit - Component initialization
   * 
   * Flow:
   * 1. Call service to fetch packages from JSON
   * 2. Subscribe to the Observable
   * 3. When data arrives, store it in packages array
   * 4. Load previously selected packages from localStorage
   * 5. Mark packages as selected if they were chosen before
   * 6. Hide loading spinner
   * 7. Trigger change detection
   */
  ngOnInit(): void {
    console.log('ngOnInit called - Initializing food packages');

    // Subscribe to get food packages from JSON file
    this.packagesSubscription = this.foodPackageService.getFoodPackages()
      .subscribe({
        /**
         * next() - Success callback
         * Executes when packages are successfully fetched from JSON
         * 
         * @param data - Array of food packages from food-package.json
         */
        next: (data) => {
          console.log('✅ Component received packages data:', data);
          console.log('✅ Number of packages:', data.length);

          // Store the fetched packages
          this.packages = data;

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

        /**
         * error() - Error callback
         * Executes if HTTP request fails
         * 
         * @param error - Error object with details
         */
        error: (error) => {
          console.error('❌ Error loading food packages:', error);

          // Hide spinner even on error
          this.isLoading = false;

          // Update view
          this.cdr.detectChanges();

          // TODO: Could show error message to user
          // alert('Failed to load packages. Please refresh the page.');
        },

        /**
         * complete() - Completion callback
         * Executes after the observable completes
         */
        complete: () => {
          console.log('✅ Packages subscription completed');
        }
      });
  }

  // ==================== LIFECYCLE HOOK: ngOnDestroy ====================

  /**
   * ngOnDestroy - Cleanup before component is destroyed
   * 
   * CRITICAL: Prevents memory leaks by unsubscribing from Observable
   */
  ngOnDestroy(): void {
    if (this.packagesSubscription) {
      this.packagesSubscription.unsubscribe();
      console.log('🧹 Packages subscription cleaned up');
    }
  }

  // ==================== PACKAGE SELECTION METHODS ====================

  /**
   * Toggle package selection
   * 
   * Special handling for À La Carte:
   * - Navigates to custom menu builder page
   * - Does not add to selectedPackages
   * 
   * For regular packages:
   * - Deselects À La Carte if it was selected
   * - Toggles the clicked package
   * - Updates selectedPackages array
   * 
   * @param pkg - Package to toggle
   */
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

  /**
   * Get comma-separated list of selected package titles
   * Used for displaying summary
   * 
   * @returns String like "Classic Kamayan, Deluxe Fiesta"
   */
  getSelectedTitles(): string {
    return this.selectedPackages.map(p => p.title).join(', ');
  }

  /**
   * Calculate total price of all selected packages
   * 
   * Filters out packages with null priceValue (like À La Carte)
   * 
   * @returns Total price in pesos
   */
  getTotalPrice(): number {
    return this.selectedPackages.reduce((total, pkg) => {
      return total + (pkg.priceValue || 0);
    }, 0);
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Proceed to payment page
   * 
   * Steps:
   * 1. Validate that at least one package is selected
   * 2. Save selection data to localStorage
   * 3. Navigate to payment page
   */
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

  /**
   * Navigate back to reserve-now page
   * Previous step in reservation flow
   */
  onBack(): void {
    this.router.navigate(['/reserve-now']);
  }

  /**
   * Show cancel confirmation modal
   * User wants to cancel the entire reservation
   */
  onCancel(): void {
    this.showCancelModal = true;
  }

  /**
   * Close cancel confirmation modal
   * User changed their mind
   */
  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  /**
   * Confirm cancellation
   * 
   * Actions:
   * - Clear all reservation data from localStorage
   * - Close modal
   * - Navigate to home page
   */
  confirmCancel(): void {
    localStorage.removeItem('reservationData');
    this.showCancelModal = false;
    this.router.navigate(['/']);
    
    console.log('Reservation cancelled');
  }
}

/**
 * ==================== DATA FLOW SUMMARY ====================
 * 
 * 1. Component loads → ngOnInit() called
 * 2. Service.getFoodPackages() → HTTP GET to data/food-package.json
 * 3. JSON response → { "foodPackages": [...] }
 * 4. map() operator → Extract foodPackages array
 * 5. subscribe() next() → Receive array of packages
 * 6. Store in this.packages
 * 7. Load saved selections from localStorage
 * 8. Mark packages as selected
 * 9. isLoading = false
 * 10. detectChanges() → View updates
 * 11. User sees packages → Can select/deselect
 * 12. Click "Proceed" → Save to localStorage → Navigate to payment
 * 
 * ==================== KEY FEATURES ====================
 * 
 * ✅ Service-based HTTP data fetching
 * ✅ Observable subscription with .subscribe()
 * ✅ Loading state with spinner
 * ✅ Error handling with catchError
 * ✅ Data transformation with map operator
 * ✅ LocalStorage persistence
 * ✅ Multi-package selection
 * ✅ Dynamic price calculation
 * ✅ À La Carte special routing
 * ✅ Cancel confirmation modal
 * ✅ Proper cleanup with ngOnDestroy
 * ✅ Change detection management
 * ✅ Stepper integration
 */