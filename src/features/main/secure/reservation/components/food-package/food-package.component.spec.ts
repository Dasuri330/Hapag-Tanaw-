import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodPackageComponent } from './food-package.component';

describe('FoodPackage', () => {
  let component: FoodPackageComponent;
  let fixture: ComponentFixture<FoodPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodPackageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoodPackageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
