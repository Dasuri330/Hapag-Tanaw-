import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/components/services/auth.service';
import { AuthModalComponent } from '../../shared/components/modals/auth-modal/auth-modal.component/auth-modal.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterLink, AuthModalComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showAuthModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onReserveNowClick(event: Event) {
    event.preventDefault();

    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // if the user has an account. proceed to reservation
      this.router.navigate(['/reserve-now']);
    } else {
      // if not. show modal
      this.showAuthModal = true;
    }
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  goToSignup() {
    this.showAuthModal = false;
    this.router.navigate(['/sign-up']);
  }
}