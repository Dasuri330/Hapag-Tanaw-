import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invalid-package-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invalid-package-modal.component.html',
  styleUrl: './invalid-package-modal.component.css'
})
export class InvalidPackageModalComponent {
  @Input() show: boolean = false;
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