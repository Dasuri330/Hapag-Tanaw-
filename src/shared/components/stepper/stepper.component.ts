import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
})
export class StepperComponent {
  @Input() currentStep: number = 1;
  @Input() isConfirmed: boolean = false;

  steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Food Package' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Confirm' },

  ];
}
