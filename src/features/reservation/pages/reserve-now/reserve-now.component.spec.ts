import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveNowComponent } from './reserve-now.component';

describe('ReserveNow', () => {
  let component: ReserveNowComponent;
  let fixture: ComponentFixture<ReserveNowComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveNowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveNowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
