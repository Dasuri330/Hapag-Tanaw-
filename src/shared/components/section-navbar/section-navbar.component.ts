import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface SectionNavItem {
  label: string;
  sectionId: string;
}

@Component({
  selector: 'app-section-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './section-navbar.component.html',
  styleUrls: ['./section-navbar.component.css']
})
export class SectionNavbarComponent implements AfterViewInit {
  @Input() sections: SectionNavItem[] = [];
  @Input() actionButton?: { label: string; routerLink: string };
  @Output() navbarReady = new EventEmitter<HTMLElement>();

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const navbar = this.el.nativeElement.querySelector('.section-navbar');
    if (navbar) {
      this.navbarReady.emit(navbar);
    }
  }
}