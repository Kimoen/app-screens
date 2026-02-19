import { Component, inject, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../i18n/translation.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { ThemeService } from '../services/theme.service';
import { CanvasStateService } from '../services/canvas-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <header class="app-header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
            <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
        <h1>App Screen Studio</h1>
      </div>

      <div class="header-controls">
        <!-- Export All (Green Button) -->
        <button class="header-btn export-btn" (click)="exportAllRequested.emit()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ 'toolbar.exportAllTabs' | translate }}
        </button>

        <!-- Undo / Redo -->
        <div class="undo-redo-group">
          <button class="header-btn icon-only" (click)="undo()" [disabled]="!canUndo()" title="Undo (Ctrl+Z)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
            </svg>
          </button>
          <button class="header-btn icon-only" (click)="redo()" [disabled]="!canRedo()" title="Redo (Ctrl+Y)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
            </svg>
          </button>
        </div>

        <!-- Clear All -->
        <button class="header-btn clear-all-btn" (click)="clearAllRequested.emit()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          {{ 'toolbar.clearAll' | translate }}
        </button>

        <div class="separator"></div>

        <button class="theme-toggle" (click)="toggleTheme()" [attr.title]="themeTitle">
          @if (isDark) {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <label class="lang-selector">
          <span class="current-flag">{{ currentFlag }}</span>
          <select [ngModel]="currentLang" (ngModelChange)="setLang($event)">
            @for (lang of languages; track lang.code) {
              <option [value]="lang.code">{{ lang.label }}</option>
            }
          </select>
        </label>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .app-header {
      height: 56px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      transition: background var(--transition), border-color var(--transition);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      color: var(--accent);
      display: flex;
      align-items: center;
    }

    h1 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.3px;
      transition: color var(--transition);
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .undo-redo-group {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-right: 8px;
      padding-right: 8px;
      border-right: 1px solid var(--border);
    }

    .header-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition);
      background: var(--bg-surface);
      color: var(--text-primary);

      &:hover:not(:disabled) {
        background: var(--bg-surface-hover);
        border-color: var(--accent);
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }
    }

    .icon-only {
      padding: 8px;
      
      svg {
        display: block;
      }
    }

    .export-btn {
      background: var(--success);
      color: #fff;
      border-color: var(--success);

      &:hover {
        background: var(--success-hover);
        border-color: var(--success-hover);
      }
    }

    .export-all-btn {
      background: var(--bg-surface-raised);
      color: var(--success);
      border-color: var(--success);

      &:hover {
        background: var(--success);
        color: #fff;
      }
    }

    .clear-all-btn {
      background: var(--bg-surface-raised);
      color: var(--danger);
      border-color: var(--border);

      &:hover {
        background: var(--danger);
        color: #fff;
        border-color: var(--danger);
      }
    }

    .separator {
      width: 1px;
      height: 24px;
      background: var(--border);
      transition: background var(--transition);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--bg-surface-raised);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);

      &:hover {
        background: var(--bg-surface-hover);
        color: var(--text-primary);
        border-color: var(--accent);
      }
    }

    .lang-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-surface-raised);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all var(--transition);

      &:hover {
        background: var(--bg-surface-hover);
        border-color: var(--accent);
      }

      .current-flag {
        font-size: 18px;
        line-height: 1;
      }

      select {
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
        cursor: pointer;

        option {
          background: var(--bg-surface);
          color: var(--text-primary);
        }
      }
    }
  `]
})
export class HeaderComponent {
  private i18n = inject(TranslationService);
  private themeService = inject(ThemeService);
  private canvasState = inject(CanvasStateService);

  @Output() exportRequested = new EventEmitter<void>();
  @Output() exportAllRequested = new EventEmitter<void>();
  @Output() clearAllRequested = new EventEmitter<void>();

  allTabs = this.canvasState.allTabs;
  screenMode = this.canvasState.screenMode;
  canUndo = this.canvasState.canUndo;
  canRedo = this.canvasState.canRedo;

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      this.redo();
    }
  }

  undo() {
    this.canvasState.undo();
  }

  redo() {
    this.canvasState.redo();
  }

  get currentLang() {
    return this.i18n.lang();
  }

  get currentFlag() {
    const lang = this.languages.find(l => l.code === this.currentLang);
    return lang ? lang.flag : '';
  }

  get isDark() {
    return this.themeService.theme() === 'dark';
  }

  get themeTitle() {
    return this.isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  setLang(lang: string) {
    this.i18n.setLang(lang as any);
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
