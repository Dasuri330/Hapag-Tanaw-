import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.css'
})
export class WarningModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Warning';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Input() icon: string = 'bi-exclamation-triangle-fill';
  @Input() confirmButtonClass: string = 'btn-danger';
  @Input() cancelButtonClass: string = 'btn-secondary';
  @Input() messageClass: string = 'modal-body-large';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancel();
    }
  }
}