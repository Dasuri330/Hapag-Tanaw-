import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
  OnInit
} from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  image: string;
  title: string;
  description: string;
  price: string;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],


  imports: [RouterLink, CommonModule, HttpClientModule],
})
export class MenuComponent implements AfterViewInit, OnInit {

  sections!: NodeListOf<HTMLElement>;
  navLinks!: NodeListOf<HTMLElement>;
  menuNavbar!: HTMLElement | null;

  menuSections$!: Observable<MenuSection[]>;

  constructor(private el: ElementRef, private http: HttpClient) { }

  ngOnInit(): void {
    this.menuSections$ = this.http.get<MenuSection[]>('assets/data/menu.json');
  }

  ngAfterViewInit(): void {
    // Wait for data to render
    setTimeout(() => {
      this.sections = this.el.nativeElement.querySelectorAll('.menu-section');
      this.navLinks = this.el.nativeElement.querySelectorAll('.second-nav .nav-link');
      this.menuNavbar = this.el.nativeElement.querySelector('#menuNav');

      this.navLinks.forEach(link => {
        const href = (link as HTMLAnchorElement).getAttribute('href');

        if (href && href.startsWith('#')) {
          link.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);

            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              this.navLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, 500);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setActiveLink();
    this.toggleNavbar();
  }

  setActiveLink(): void {
    if (!this.sections || !this.navLinks) return;

    let index = this.sections.length;

    while (
      --index &&
      window.scrollY + 100 < this.sections[index].offsetTop
    ) { }

    this.navLinks.forEach(link => {
      if ((link as HTMLAnchorElement).getAttribute('href')?.startsWith('#')) {
        link.classList.remove('active');
      }
    });

    const activeLink = Array.from(this.navLinks).find(link => {
      return (link as HTMLAnchorElement).getAttribute('href') === `#${this.sections[index].id}`;
    });

    if (activeLink) activeLink.classList.add('active');
  }

  toggleNavbar(): void {
    if (!this.menuNavbar) return;

    if (window.scrollY > 50) {
      this.menuNavbar.classList.add('scrolled');
    } else {
      this.menuNavbar.classList.remove('scrolled');
    }
  }
}