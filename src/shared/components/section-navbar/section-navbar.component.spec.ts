import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionNavbar } from './section-navbar.component';

describe('SectionNavbar', () => {
  let component: SectionNavbar;
  let fixture: ComponentFixture<SectionNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
