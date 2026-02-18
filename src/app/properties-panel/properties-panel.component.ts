import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanvasStateService } from '../services/canvas-state.service';
import { TextElement, ImageElement, PhoneMockupElement, BannerElement } from '../models/canvas-element.model';
import { TranslatePipe } from '../i18n/translate.pipe';
import { ColorHexInputComponent } from '../color-hex-input/color-hex-input.component';

const GOOGLE_FONTS = [
  'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Inter',
  'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 'Playfair Display',
  'Merriweather', 'Bebas Neue', 'Anton', 'Permanent Marker',
  'Bangers', 'Pacifico', 'Lobster', 'Dancing Script', 'Caveat',
];

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, ColorHexInputComponent],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
})
export class PropertiesPanelComponent {
  private canvasState = inject(CanvasStateService);

  selectedElement = this.canvasState.selectedElement;
  fonts = GOOGLE_FONTS;

  get textEl(): TextElement | null {
    const el = this.selectedElement();
    return el?.type === 'text' ? (el as TextElement) : null;
  }

  get imageEl(): ImageElement | null {
    const el = this.selectedElement();
    return el?.type === 'image' ? (el as ImageElement) : null;
  }

  get phoneEl(): PhoneMockupElement | null {
    const el = this.selectedElement();
    return el?.type === 'phone-mockup' ? (el as PhoneMockupElement) : null;
  }

  get bannerEl(): BannerElement | null {
    const el = this.selectedElement();
    return el?.type === 'banner' ? (el as BannerElement) : null;
  }

  updateProp(prop: string, value: any) {
    const el = this.selectedElement();
    if (!el) return;
    this.canvasState.updateElement(el.id, { [prop]: value } as any);
  }

  onNumberChange(prop: string, event: Event) {
    const el = this.selectedElement();
    if (!el) return;
    const val = +(event.target as HTMLInputElement).value;

    // Keep aspect ratio for phone mockups when changing width or height
    if (el.type === 'phone-mockup' && (prop === 'width' || prop === 'height')) {
      const ratio = el.width / el.height;
      if (prop === 'width') {
        this.canvasState.updateElement(el.id, { width: val, height: Math.round(val / ratio) } as any);
      } else {
        this.canvasState.updateElement(el.id, { width: Math.round(val * ratio), height: val } as any);
      }
      return;
    }

    this.updateProp(prop, val);
  }

  changeScreenshot() {
    const el = this.phoneEl;
    if (!el) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.canvasState.updateElement(el.id, { screenshotSrc: reader.result as string } as any);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  changeImageSrc() {
    const el = this.imageEl;
    if (!el) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.canvasState.updateElement(el.id, { src: reader.result as string } as any);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  deleteElement() {
    const el = this.selectedElement();
    if (el) this.canvasState.deleteElement(el.id);
  }

  bringToFront() {
    const el = this.selectedElement();
    if (el) this.canvasState.bringToFront(el.id);
  }

  onScaleSlider(event: Event) {
    const el = this.selectedElement();
    if (!el) return;
    const newWidth = +(event.target as HTMLInputElement).value;
    const ratio = el.width / el.height;
    this.canvasState.updateElement(el.id, {
      width: newWidth,
      height: Math.round(newWidth / ratio),
    } as any);
  }

  sendToBack() {
    const el = this.selectedElement();
    if (el) this.canvasState.sendToBack(el.id);
  }
}
