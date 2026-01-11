import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/components/navbar/navbar';
import { Footer } from '../shared/components/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, FontAwesomeModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Hapag_Tanaw_Angular');

  constructor(private router: Router) { }

  isAuthPage(): boolean {
    const authRoutes = ['/signup', '/login', '/sign-up'];
    return authRoutes.includes(this.router.url);
  }
}