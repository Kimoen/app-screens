import { Injectable, signal, computed, effect } from '@angular/core';
import { fr } from './translations/fr';
import { en } from './translations/en';

export type Lang = 'fr' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, string>> = { fr, en };
const STORAGE_KEY = 'app-screens-lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang = signal<Lang>(this.detectLanguage());
  readonly translations = computed(() => TRANSLATIONS[this.lang()]);

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this.lang());
      document.documentElement.lang = this.lang();
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  toggleLang(): void {
    this.lang.update(current => current === 'fr' ? 'en' : 'fr');
  }

  t(key: string, params?: Record<string, string | number>): string {
    let value = this.translations()[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  }

  private detectLanguage(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
    const browserLang = navigator.language?.substring(0, 2)?.toLowerCase();
    return browserLang === 'fr' ? 'fr' : 'en';
  }
}
