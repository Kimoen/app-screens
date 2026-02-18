import { Component, Input } from '@angular/core';
// Force rebuild
import { NgStyle } from '@angular/common';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-phone-mockup',
  standalone: true,
  imports: [NgStyle, TranslatePipe],
  templateUrl: './phone-mockup.component.html',
  styleUrl: './phone-mockup.component.scss',
})
export class PhoneMockupComponent {
  @Input() screenshotSrc = '';
  @Input() width = 700;
  @Input() height = 1400;
  @Input() borderEnabled = false;
  @Input() borderColor = '#3b82f6';
  @Input() borderWidth = 3;
  @Input() glowEnabled = false;
  @Input() glowColor = '#3b82f6';
  @Input() glowSize = 20;
  @Input() frameType: 'original' | 'clay' | 'flat' | 'minimal' = 'original';
  @Input() frameColor = '#1c1c1e';

  get bezelClasses(): string {
    return `phone-bezel style-${this.frameType}`;
  }

  get bezelStyle(): Record<string, string> {
    const styles: Record<string, string> = {};

    // Specific styles per type
    if (this.frameType === 'clay') {
      styles['background-color'] = this.frameColor;
      styles['box-shadow'] = `
        20px 20px 60px rgba(0,0,0,0.1),
        -20px -20px 60px rgba(255,255,255,0.1),
        inset -5px -5px 15px rgba(0,0,0,0.1), 
        inset 5px 5px 15px rgba(255,255,255,0.2)
      `;
      styles['border'] = 'none';
    } else if (this.frameType === 'flat') {
      styles['background-color'] = this.frameColor;
      styles['box-shadow'] = 'none';
      styles['border'] = 'none';
    } else if (this.frameType === 'minimal') {
      styles['background-color'] = 'transparent';
      styles['box-shadow'] = 'none';
      styles['border'] = `4px solid ${this.frameColor}`;
    } else {
      // Original
      styles['background-color'] = '#1c1c1e';
      styles['border'] = '2px solid #3a3a3c';
    }

    // Overrides if border explicitly enabled (legacy or specific use)
    if (this.borderEnabled) {
      styles['border'] = `${this.borderWidth}px solid ${this.borderColor}`;
    }

    if (this.glowEnabled) {
      const p = this.glowSize;
      styles['position'] = 'absolute';
      styles['top'] = `${p}px`;
      styles['left'] = `${p}px`;
      styles['right'] = `${p}px`;
      styles['bottom'] = `${p}px`;
      styles['width'] = 'auto';
      styles['height'] = 'auto';
    }

    return styles;
  }

  get glowRings(): Record<string, string>[] {
    if (!this.glowEnabled) return [];
    const steps = 5;
    const perRingOpacity = 0.12;
    const rings: Record<string, string>[] = [];
    for (let i = 0; i < steps; i++) {
      const inset = Math.round(this.glowSize * i / steps);
      rings.push({
        position: 'absolute',
        top: `${inset}px`,
        left: `${inset}px`,
        right: `${inset}px`,
        bottom: `${inset}px`,
        'border-radius': '7.5% / 3.5%',
        background: this.glowColor,
        opacity: `${perRingOpacity}`,
      });
    }
    return rings;
  }
}
