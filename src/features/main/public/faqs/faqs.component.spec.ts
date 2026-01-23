import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQsComponents } from './faqs.component';

describe('FAQs', () => {
  let component: FAQsComponents;
  let fixture: ComponentFixture<FAQsComponents>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FAQsComponents]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FAQsComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
