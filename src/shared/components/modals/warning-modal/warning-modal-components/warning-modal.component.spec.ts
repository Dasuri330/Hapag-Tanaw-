import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningModalComponent } from './warning-modal.component';

describe('WarningModal', () => {
  let component: WarningModalComponent;
  let fixture: ComponentFixture<WarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
