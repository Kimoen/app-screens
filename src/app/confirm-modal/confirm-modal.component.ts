import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="overlay" (click)="cancelled.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <p class="message">{{ message }}</p>
        <div class="actions">
          <button class="btn btn-cancel" (click)="cancelled.emit()">{{ 'confirm.cancel' | translate }}</button>
          <button class="btn btn-confirm" (click)="confirmed.emit()">{{ 'confirm.confirm' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: var(--overlay);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .modal {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px 32px;
      min-width: 340px;
      max-width: 460px;
      box-shadow: var(--shadow-lg);
      transition: background var(--transition), border-color var(--transition);
    }
    .message {
      color: var(--text-primary);
      font-size: 15px;
      margin: 0 0 20px;
      line-height: 1.5;
      transition: color var(--transition);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition);
    }
    .btn-cancel {
      background: var(--bg-surface-raised);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-cancel:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .btn-confirm {
      background: var(--danger);
      color: #fff;
    }
    .btn-confirm:hover {
      background: var(--danger-hover);
    }
  `],
})
export class ConfirmModalComponent {
  @Input() message = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
