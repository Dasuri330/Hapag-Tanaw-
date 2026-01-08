import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';

describe('Confirm', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
