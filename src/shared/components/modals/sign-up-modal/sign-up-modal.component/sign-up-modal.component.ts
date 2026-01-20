import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sign-up-modal.component.html',
  styleUrl: './sign-up-modal.component.css'
})
export class SignUpModalComponent {
  @Input() show = false;
  @Input() isSuccess = true;
  @Input() message = '';
  @Input() userName = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}