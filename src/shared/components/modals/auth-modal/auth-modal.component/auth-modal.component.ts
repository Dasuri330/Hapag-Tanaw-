import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() goToSignup = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onOkay() {
    this.goToSignup.emit();
  }
}