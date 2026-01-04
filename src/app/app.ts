import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from '../layout/navbar/navbar';
import { Footer } from '../layout/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, FontAwesomeModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Hapag_Tanaw_Angular');
}
