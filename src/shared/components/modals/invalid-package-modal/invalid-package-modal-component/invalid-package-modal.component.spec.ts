import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidPackageModalComponent } from './invalid-package-modal.component';

describe('InvalidPackageModalComponent', () => {
  let component: InvalidPackageModalComponent;
  let fixture: ComponentFixture<InvalidPackageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvalidPackageModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InvalidPackageModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
