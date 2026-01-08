import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayaComponent } from './maya.component';

describe('Maya', () => {
  let component: MayaComponent;
  let fixture: ComponentFixture<MayaComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MayaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MayaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
