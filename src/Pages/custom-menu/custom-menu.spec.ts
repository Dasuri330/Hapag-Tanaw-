import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMenuComponent } from './custom-menu';

describe('CustomMenu', () => {
  let component: CustomMenuComponent;
  let fixture: ComponentFixture<CustomMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
