import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionNavbarComponent } from './section-navbar.component';

describe('SectionNavbar', () => {
  let component: SectionNavbarComponent;
  let fixture: ComponentFixture<SectionNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionNavbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SectionNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});