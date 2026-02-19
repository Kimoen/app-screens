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
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .modal {
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 24px 32px;
      min-width: 340px;
      max-width: 460px;
    }
    .message {
      color: #eee;
      font-size: 15px;
      margin: 0 0 20px;
      line-height: 1.4;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-cancel {
      background: #333;
      color: #ccc;
    }
    .btn-cancel:hover {
      background: #444;
    }
    .btn-confirm {
      background: #ef4444;
      color: #fff;
    }
    .btn-confirm:hover {
      background: #dc2626;
    }
  `],
})
export class ConfirmModalComponent {
  @Input() message = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
