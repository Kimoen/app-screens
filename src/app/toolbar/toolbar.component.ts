import { Component, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanvasStateService } from '../services/canvas-state.service';
import { LAYOUT_TEMPLATES, LayoutTemplate } from '../layouts/layout-templates';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  private canvasState = inject(CanvasStateService);

  @Output() exportRequested = new EventEmitter<void>();

  layouts = LAYOUT_TEMPLATES;
  state = this.canvasState.canvasState;

  // Background controls
  bgType: 'solid' | 'gradient' = 'gradient';
  bgColor = '#1a1a2e';
  gradStart = '#0f0c29';
  gradEnd = '#302b63';
  gradAngle = 180;

  addText() {
    this.canvasState.addText();
  }

  addImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          this.canvasState.addImage(reader.result as string, img.naturalWidth, img.naturalHeight);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  addPhoneMockup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.canvasState.addPhoneMockup(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  addEmptyPhoneMockup() {
    this.canvasState.addPhoneMockup('');
  }

  applyLayout(layout: LayoutTemplate) {
    this.canvasState.loadLayout(
      layout.createElements(),
      layout.bgType,
      layout.bgColor,
      layout.gradStart,
      layout.gradEnd,
      layout.gradAngle
    );
    this.bgType = layout.bgType;
    this.bgColor = layout.bgColor;
    this.gradStart = layout.gradStart;
    this.gradEnd = layout.gradEnd;
    this.gradAngle = layout.gradAngle;
  }

  onBgTypeChange() {
    this.canvasState.setBackgroundType(this.bgType);
  }

  onBgColorChange() {
    this.canvasState.setBackgroundColor(this.bgColor);
  }

  onGradStartChange() {
    this.canvasState.setGradientStart(this.gradStart);
  }

  onGradEndChange() {
    this.canvasState.setGradientEnd(this.gradEnd);
  }

  onGradAngleChange() {
    this.canvasState.setGradientAngle(this.gradAngle);
  }

  clearAll() {
    this.canvasState.clearAll();
    this.bgType = 'gradient';
    this.bgColor = '#1a1a2e';
    this.gradStart = '#0f0c29';
    this.gradEnd = '#302b63';
    this.gradAngle = 180;
  }

  exportPng() {
    this.exportRequested.emit();
  }
}
