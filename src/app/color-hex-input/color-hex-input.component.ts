import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-hex-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="color-hex-group">
      <input
        type="color"
        [ngModel]="color()"
        (ngModelChange)="onColorChange($event)"
      />
      <input
        type="text"
        class="hex-input"
        [value]="color()"
        (keydown.enter)="onHexInput($event)"
        (blur)="onHexInput($event)"
        maxlength="7"
        spellcheck="false"
      />
    </div>
  `,
  styles: [`
    .color-hex-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    input[type='color'] {
      width: 32px;
      height: 24px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: none;
      cursor: pointer;
      padding: 1px;
      flex-shrink: 0;
      transition: border-color var(--transition);
    }
    .hex-input {
      width: 72px;
      background: var(--bg-input);
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 4px 6px;
      font-size: 11px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      transition: all var(--transition);

      &:focus {
        border-color: var(--accent);
        outline: none;
      }
    }
  `],
})
export class ColorHexInputComponent {
  color = input.required<string>();
  colorChange = output<string>();

  onColorChange(value: string) {
    this.colorChange.emit(value);
  }

  onHexInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.trim();
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      this.colorChange.emit(val);
    } else {
      input.value = this.color();
    }
  }
}
