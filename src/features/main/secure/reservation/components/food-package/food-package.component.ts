import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { WarningModalComponent } from '@shared/components/modals/warning-modal/warning-modal-components/warning-modal.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { FoodPackageService, FoodPackage } from '@shared/components/services/food-package.service';

@Component({
  selector: 'app-food-package',
  standalone: true,
  imports: [CommonModule, WarningModalComponent, StepperComponent],
  templateUrl: './food-package.component.html',
  styleUrl: './food-package.component.css',
})
export class FoodPackageComponent {

  // Inject services 
  private foodPackageService = inject(FoodPackageService);
  private router = inject(Router);

  currentStep = 2;
  showCancelModal = signal(false);

  // Signal that stores selected packages
  selectedPackages = signal<FoodPackage[]>([]);

  // Convert Observable from service into a Signal
  private packagesData = toSignal(
    this.foodPackageService.getFoodPackages(),
    { initialValue: null }
  );

  // Writable signal for packages (so we can update the UI)
  packages = signal<FoodPackage[]>([]);

  // Computed loading state (true while packagesData is still null)
  isLoading = computed(() => this.packagesData() === null);

  constructor() {
    console.log('FoodPackageComponent constructor called');

    // Effect runs automatically whenever packagesData() changes
    // Used to load packages and restore selected packages after data is loaded
    effect(() => {
      const data = this.packagesData();
      if (!data) return;

      // Get previously saved reservation data
      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      const savedPackages = reservationData.selectedPackages || [];

      // Mark packages as selected if they exist in savedPackages
      const loadedPackages = data.foodPackages.map(pkg => ({
        ...pkg,
        selected: savedPackages.some((sp: FoodPackage) => sp.title === pkg.title)
      }));

      // Set the packages signal
      this.packages.set(loadedPackages);

      // Restore selected packages
      if (savedPackages.length > 0) {
        this.selectedPackages.set(savedPackages);
        console.log('Restored selected packages:', this.selectedPackages());
      }
    });
  }

  // Handles clicking a package card
  togglePackage(pkg: FoodPackage): void {
    console.log('Package clicked:', pkg.title);

    // Special case: redirect to custom menu if "À La Carte" is chosen
    if (pkg.title === 'À La Carte') {
      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      reservationData.currentStep = this.currentStep;
      reservationData.foodPackage = 'À La Carte';
      localStorage.setItem('reservationData', JSON.stringify(reservationData));
      this.router.navigate(['/main/secure/reservation/custom-menu']);
      return;
    }

    // Toggle the selected state in packages signal
    this.packages.update(pkgs =>
      pkgs.map(p => {
        if (p.title === 'À La Carte') return { ...p, selected: false }; // Unselect À La Carte
        if (p.title === pkg.title) return { ...p, selected: !p.selected }; // Toggle clicked package
        return p;
      })
    );

    // Update selectedPackages based on current packages state
    const currentPackage = this.packages().find(p => p.title === pkg.title);

    if (currentPackage?.selected) {
      // Add to selected if now selected
      this.selectedPackages.update(selected => [...selected, pkg]);
    } else {
      // Remove from selected if now unselected
      this.selectedPackages.update(selected =>
        selected.filter(p => p.title !== pkg.title)
      );
    }

    console.log('Currently selected:', this.selectedPackages().map(p => p.title));
  }

  // Returns selected package titles as a string
  getSelectedTitles(): string {
    return this.selectedPackages().map(p => p.title).join(', ');
  }

  // Calculates total price of selected packages
  getTotalPrice(): number {
    return this.selectedPackages().reduce((total, pkg) => {
      return total + (pkg.priceValue || 0);
    }, 0);
  }

  // Saves selection and moves to confirm page
  proceedToPayment(): void {
    if (this.selectedPackages().length === 0) {
      alert('Please select at least one package!');
      return;
    }

    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    reservationData.selectedPackages = this.selectedPackages();
    reservationData.foodPackage = this.selectedPackages().map(p => p.title).join(', ');
    reservationData.packagePrice = this.getTotalPrice();
    reservationData.currentStep = 3;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    this.router.navigate(['/main/secure/reservation/payment']);
  }

  // Go back to previous step
  onBack(): void {
    this.router.navigate(['/main/secure/reservation']);
  }

  // Show cancel confirmation modal
  onCancel(): void {
    this.showCancelModal.set(true);
  }

  // Hide cancel modal
  closeCancelModal(): void {
    this.showCancelModal.set(false);
  }

  // Clear reservation data and return home
  confirmCancel(): void {
    localStorage.removeItem('reservationData');
    this.showCancelModal.set(false);
    this.router.navigate(['/']);
  }
}