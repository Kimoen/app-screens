import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="app-header">
      <div class="logo">
        <h1>App Screen Studio</h1>
      </div>
      
      <div class="header-controls">
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
      height: 60px;
      background: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
    }
    
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .lang-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #252525;
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid #333;
      position: relative;
      
      .current-flag {
        font-size: 20px;
        line-height: 1;
      }
      
      select {
        background: transparent;
        border: none;
        color: #ccc;
        font-size: 14px;
        outline: none;
        cursor: pointer;
        
        option {
          background: #252525;
          color: #ccc;
        }
      }
    }
  `]
})
export class HeaderComponent {
  private i18n = inject(TranslationService);

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  get currentLang() {
    return this.i18n.lang();
  }

  get currentFlag() {
    const lang = this.languages.find(l => l.code === this.currentLang);
    return lang ? lang.flag : '';
  }

  setLang(lang: string) {
    this.i18n.setLang(lang as any);
  }
}
