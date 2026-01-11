import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Input() icon: string = 'bi-exclamation-triangle-fill';
  @Input() buttonText: string = 'Okay';
  @Input() buttonClass: string = 'btn-custom';
  @Input() headerClass: string = 'modal-header-orange';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }
}