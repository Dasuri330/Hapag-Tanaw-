import {
  Component,
  signal,
  computed,
  effect,
  inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
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

  // Sticky summary
  @ViewChild('summaryRef') summaryRef!: ElementRef;
  isSummaryStuck = false;

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.summaryRef) {
      const rect = this.summaryRef.nativeElement.getBoundingClientRect();
      this.isSummaryStuck = rect.top <= 12;
    }
  }

  // Signal that stores selected packages
  selectedPackages = signal<FoodPackage[]>([]);

  // Convert Observable from service into a Signal
  private packagesData = toSignal(this.foodPackageService.getFoodPackages(), {
    initialValue: null,
  });

  // Writable signal for packages
  packages = signal<FoodPackage[]>([]);

  // Computed loading state. true while packagesData is still null
  isLoading = computed(() => this.packagesData() === null);

  constructor() {
    console.log('FoodPackageComponent constructor called');

    effect(() => {
      const data = this.packagesData();
      if (!data) return;

      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      const savedPackages = reservationData.selectedPackages || [];

      const loadedPackages = data.foodPackages.map((pkg) => ({
        ...pkg,
        selected: savedPackages.some((sp: FoodPackage) => sp.title === pkg.title),
      }));

      this.packages.set(loadedPackages);

      if (savedPackages.length > 0) {
        this.selectedPackages.set(savedPackages);
        console.log('Restored selected packages:', this.selectedPackages());
      }
    });
  }

  togglePackage(pkg: FoodPackage): void {
    console.log('Package clicked:', pkg.title);

    if (pkg.title === 'À La Carte') {
      const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
      reservationData.currentStep = this.currentStep;
      reservationData.selectedPackages = this.selectedPackages();
      reservationData.packagePrice = this.getTotalPrice();

      const packageNames = this.selectedPackages().map((p) => p.title);
      packageNames.push('À La Carte');
      reservationData.foodPackage = packageNames.join(', ');

      localStorage.setItem('reservationData', JSON.stringify(reservationData));
      this.router.navigate(['/main/secure/reservation/custom-menu']);
      return;
    }

    this.packages.update((pkgs) =>
      pkgs.map((p) => {
        if (p.title === 'À La Carte') return { ...p, selected: false };
        if (p.title === pkg.title) return { ...p, selected: !p.selected };
        return p;
      }),
    );

    const currentPackage = this.packages().find((p) => p.title === pkg.title);

    if (currentPackage?.selected) {
      this.selectedPackages.update((selected) => [...selected, pkg]);
    } else {
      this.selectedPackages.update((selected) => selected.filter((p) => p.title !== pkg.title));
    }

    console.log(
      'Currently selected:',
      this.selectedPackages().map((p) => p.title),
    );
  }

  getSelectedTitles(): string {
    return this.selectedPackages()
      .map((p) => p.title)
      .join(', ');
  }

  getTotalPrice(): number {
    return this.selectedPackages().reduce((total, pkg) => {
      return total + (pkg.priceValue || 0);
    }, 0);
  }

  proceedToPayment(): void {
    if (this.selectedPackages().length === 0) {
      alert('Please select at least one package!');
      return;
    }

    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    reservationData.selectedPackages = this.selectedPackages();
    reservationData.foodPackage = this.selectedPackages()
      .map((p) => p.title)
      .join(', ');
    reservationData.packagePrice = this.getTotalPrice();
    reservationData.currentStep = 3;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    this.router.navigate(['/main/secure/reservation/payment']);
  }

  onBack(): void {
    this.router.navigate(['/main/secure/reservation']);
  }

  onCancel(): void {
    this.showCancelModal.set(true);
  }

  closeCancelModal(): void {
    this.showCancelModal.set(false);
  }

  confirmCancel(): void {
    localStorage.removeItem('reservationData');
    this.showCancelModal.set(false);
    this.router.navigate(['/']);
  }
}
