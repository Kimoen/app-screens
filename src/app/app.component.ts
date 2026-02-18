import { Component, inject, effect } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { TranslationService } from './i18n/translation.service';

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  template: '<app-editor />',
  styles: [':host { display: block; }'],
})
export class AppComponent {
  private i18n = inject(TranslationService);

  constructor() {
    effect(() => {
      document.title = this.i18n.t('page.title');
    });
  }
}
