import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.css'
})
export class SuccessModalComponent {
  @Input() show: boolean = false;
  @Input() email: string = '';
  @Output() goHome = new EventEmitter<void>();

  onGoHome(): void {
    this.goHome.emit();
  }
}