import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  buttons = [
    {
      label: 'Cancel',
      class: 'btn-secondary',
      action: () => this.onClose()
    },
    {
      label: 'Sign Up',
      class: 'custom-btn',
      action: () => this.onSignUp()
    },
    {
      label: 'Log In',
      class: 'custom-btn',
      action: () => this.onLogin()
    },
  ];

  constructor(private router: Router) { }

  onClose() {
    this.close.emit();
  }

  onSignUp() {
    this.router.navigate(['/signup']);
    this.onClose();
  }

  onLogin() {
    this.router.navigate(['/login']);
    this.onClose();
  }

  onOkay() {
    this.goToSignup.emit();
  }
}