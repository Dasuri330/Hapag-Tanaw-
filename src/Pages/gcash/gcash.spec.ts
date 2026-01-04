import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcashComponent } from './gcash';

describe('Gcash', () => {
  let component: GcashComponent;
  let fixture: ComponentFixture<GcashComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GcashComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GcashComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
