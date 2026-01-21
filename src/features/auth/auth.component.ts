import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor(private router: Router) {}

  getTitle(): string {
    if (this.router.url.includes('login')) {
      return 'Your Taste of Filipino Tradition.';
    }
    return 'The Best View of the Feast, Starts Here.';
  }

  getDescription(): string {
    return 'Reserve your table with ease, creating memorable dining experience, manage bookings and your dining history.';
  }
}