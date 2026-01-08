import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQs } from './faqs.component';

describe('FAQs', () => {
  let component: FAQs;
  let fixture: ComponentFixture<FAQs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FAQs]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FAQs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
