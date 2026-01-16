import { Component, AfterViewInit, ElementRef, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { SectionNavbarComponent, SectionNavItem } from '../../shared/components/section-navbar/section-navbar.component';

// Service that fetches menu data
import { MenuService, MenuSection } from '../../shared/components/services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, SectionNavbarComponent],
})
export class MenuComponent implements AfterViewInit, OnInit, OnDestroy {

  // DOM elements collected after the view is rendered
  sections!: NodeListOf<HTMLElement>;   // All menu sections
  navLinks!: NodeListOf<HTMLElement>;   // All navigation links
  menuNavbar!: HTMLElement | null;      // Navbar element

  // Data from the service
  menuSections: MenuSection[] = [];      // Menu sections list
  isLoading: boolean = true;             // Loading state

  // Section navigation items
  sectionNavItems: SectionNavItem[] = [];

  // Reserve button config
  reserveButton = {
    label: 'Reserve Now',
    routerLink: '/reserve-now'
  };

  // To unsubscribe later when component is destroyed
  private menuSubscription?: Subscription;

  // Constructor: services are injected here
  constructor(
    private el: ElementRef,              // Access to this component's DOM
    private menuService: MenuService,    // Service to get menu data
    private cdr: ChangeDetectorRef       // To force UI update when needed
  ) {
    console.log('MenuComponent constructor called');
  }

  // Runs when the component is initialized
  ngOnInit(): void {
    console.log('ngOnInit called - Starting to fetch menu');
    console.log('Initial isLoading:', this.isLoading);
    console.log('Initial menuSections:', this.menuSections);

    // Subscribe to the observable from the service
    this.menuSubscription = this.menuService.getMenuSections()
      .subscribe({
        // When data is received
        next: (data) => {
          console.log('Component received data:', data);
          console.log('Data length:', data.length);

          this.menuSections = data;   // Save data

          // Create section nav items from menu sections
          this.sectionNavItems = data.map(section => ({
            label: section.title,
            sectionId: section.id
          }));

          this.isLoading = false;     // Stop loading

          console.log('After update - isLoading:', this.isLoading);
          console.log('After update - menuSections length:', this.menuSections.length);
          console.log('After update - menuSections:', this.menuSections);
          console.log('Section nav items:', this.sectionNavItems);

          // Force Angular to update the UI
          this.cdr.detectChanges();
          console.log('Change detection triggered');
        },
        // If an error happens
        error: (error) => {
          console.error('Component error:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        // When the stream completes
        complete: () => {
          console.log('Subscription completed');
        }
      });
  }

  // Called when navbar emits the ready event
  onNavbarReady(navbar: HTMLElement): void {
    this.menuNavbar = navbar;
    console.log('Navbar ready:', navbar);
  }

  // Runs after the HTML view is fully rendered
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    console.log('AfterViewInit - isLoading:', this.isLoading);
    console.log('AfterViewInit - menuSections:', this.menuSections.length);

    // Delay to make sure all dynamic content is rendered
    setTimeout(() => {
      // Get all menu sections from the DOM
      this.sections = this.el.nativeElement.querySelectorAll('.menu-section');
      // Get all navigation links
      this.navLinks = this.el.nativeElement.querySelectorAll('.second-nav .nav-link');

      console.log('Found sections:', this.sections.length);
      console.log('Found nav links:', this.navLinks.length);

      // Add click event to each nav link
      this.navLinks.forEach(link => {
        const href = (link as HTMLAnchorElement).getAttribute('href');

        // If it's an anchor link like #section
        if (href && href.startsWith('#')) {
          link.addEventListener('click', (e: Event) => {
            e.preventDefault(); // Stop default jump

            const targetId = href.substring(1); // Remove #
            const target = document.getElementById(targetId);

            if (target) {
              // Smooth scroll to section
              target.scrollIntoView({ behavior: 'smooth' });

              // Remove active from all links
              this.navLinks.forEach(l => l.classList.remove('active'));

              // Add active to clicked link
              link.classList.add('active');
            }
          });
        }
      });
    }, 1000);
  }

  // Runs when the component is about to be destroyed
  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe(); // Stop listening to observable
      console.log('Subscription cleaned up');
    }
  }

  // Listen to window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setActiveLink(); // Update active nav link
    this.toggleNavbar();  // Change navbar style on scroll
  }

  // Sets the active nav link based on scroll position
  setActiveLink(): void {
    if (!this.sections || !this.navLinks) return;

    let index = this.sections.length;

    // Find which section is currently in view
    while (
      --index &&
      window.scrollY + 100 < this.sections[index].offsetTop
    ) { }

    // Remove active class from all links
    this.navLinks.forEach(link => {
      if ((link as HTMLAnchorElement).getAttribute('href')?.startsWith('#')) {
        link.classList.remove('active');
      }
    });

    // Find the link that matches the current section
    const activeLink = Array.from(this.navLinks).find(link => {
      return (link as HTMLAnchorElement).getAttribute('href') === `#${this.sections[index].id}`;
    });

    // Add active class
    if (activeLink) activeLink.classList.add('active');
  }

  // Adds or removes class on navbar when scrolling
  toggleNavbar(): void {
    if (!this.menuNavbar) return;

    if (window.scrollY > 50) {
      this.menuNavbar.classList.add('scrolled'); // When scrolled down
    } else {
      this.menuNavbar.classList.remove('scrolled'); // When at top
    }
  }
}