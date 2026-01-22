import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-error-modal.component.html',
  styleUrls: ['./login-error-modal.component.css']
})
export class LoginErrorModalComponent {
  @Input() show = false;
  @Input() message = '';
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