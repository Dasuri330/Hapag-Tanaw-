import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../shared/components/services/auth.service';
import { LogoutComponent } from '../modals/logout-modal/logout/logout-modal.component';
interface UserData {
  fullName: string;
  email: string;
}

interface Reservation {
  date: string;
  timeStart: string;
  timeEnd: string;
  numGuests: string | number;
  specialOccasion?: string;
  specialRequests?: string;
  foodPackage?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LogoutComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userData: UserData | null = null;
  reservations: Reservation[] = [];
  showDropdown = false;
  showLogoutModal = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkLoginStatus();

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.updateUserData(user);
    });
  }

  checkLoginStatus() {
    const currentUser = this.authService.getCurrentUser();
    this.updateUserData(currentUser);
  }

  private updateUserData(user: User | null) {
    if (user) {
      this.isLoggedIn = true;
      this.userData = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,

      };

      console.log('User is logged in:', this.userData);

      // Load reservations
      this.loadReservations();
    } else {
      this.isLoggedIn = false;
      this.userData = null;
      this.reservations = [];
      console.log('User is NOT logged in');
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;

    // Refresh reservations every time dropdown opens
    if (this.showDropdown) {
      this.loadReservations();
    }
  }

  private loadReservations() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.reservations = [];
      return;
    }

    const userReservationsKey = `reservations_${currentUser.email}`;
    const reservationsString = localStorage.getItem(userReservationsKey);

    if (reservationsString) {
      this.reservations = JSON.parse(reservationsString);
      console.log('Reservations loaded:', this.reservations);
    } else {
      this.reservations = [];
      console.log('No reservations found for user');
    }
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  // Trigger logout modal
  logout() {
    this.showLogoutModal = true;
    this.showDropdown = false; // close dropdown when opening modal
  }

  // Close modal without logout
  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  // Confirm logout
  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();

    // Redirect to home
    this.router.navigate(['/']);
  }
}
