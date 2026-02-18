import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-phone-mockup',
  standalone: true,
  imports: [NgStyle],
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

  get bezelStyle(): Record<string, string> {
    const styles: Record<string, string> = {};

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
