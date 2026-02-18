import { Component, ElementRef, ViewChild, Input, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasStateService } from '../services/canvas-state.service';
import { PhoneMockupComponent } from '../phone-mockup/phone-mockup.component';
import { CanvasElement, TextElement, ImageElement, PhoneMockupElement } from '../models/canvas-element.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, PhoneMockupComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  private canvasState = inject(CanvasStateService);

  @ViewChild('canvasEl', { static: true }) canvasEl!: ElementRef<HTMLDivElement>;
  @Input() displayScale = 1;

  readonly CANVAS_H = 1920;
  readonly SLICE_W = 1080;

  canvasWidth = this.canvasState.canvasWidth;
  screenMode = this.canvasState.screenMode;
  elements = this.canvasState.elements;
  selectedId = this.canvasState.selectedElementId;
  bgStyle = this.canvasState.backgroundStyle;

  private dragging: { id: string; startMouseX: number; startMouseY: number; startElX: number; startElY: number } | null = null;
  private resizing: { id: string; startX: number; startY: number; startW: number; startH: number; ratio: number | null } | null = null;

  get canvasElement(): HTMLDivElement {
    return this.canvasEl.nativeElement;
  }

  onElementMouseDown(event: MouseEvent, element: CanvasElement) {
    // Ignore if clicking on resize handle
    if ((event.target as HTMLElement).classList.contains('resize-handle')) return;
    event.stopPropagation();
    event.preventDefault();
    this.canvasState.selectElement(element.id);
    this.dragging = {
      id: element.id,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startElX: element.x,
      startElY: element.y,
    };
  }

  onCanvasClick() {
    this.canvasState.selectElement(null);
  }

  onResizeStart(event: MouseEvent, element: CanvasElement) {
    event.stopPropagation();
    event.preventDefault();
    const lockRatio = element.type === 'phone-mockup';
    this.resizing = {
      id: element.id,
      startX: event.clientX,
      startY: event.clientY,
      startW: element.width,
      startH: element.height,
      ratio: lockRatio ? element.width / element.height : null,
    };
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const scale = this.displayScale;

    if (this.dragging) {
      const dx = (event.clientX - this.dragging.startMouseX) / scale;
      const dy = (event.clientY - this.dragging.startMouseY) / scale;
      this.canvasState.moveElement(
        this.dragging.id,
        Math.round(this.dragging.startElX + dx),
        Math.round(this.dragging.startElY + dy)
      );
      return;
    }

    if (this.resizing) {
      const dx = (event.clientX - this.resizing.startX) / scale;
      const dy = (event.clientY - this.resizing.startY) / scale;

      let newW = this.resizing.startW + dx;
      let newH = this.resizing.startH + dy;

      if (this.resizing.ratio !== null) {
        newH = this.resizing.startH + dy;
        newW = newH * this.resizing.ratio;
      }

      this.canvasState.resizeElement(
        this.resizing.id,
        Math.round(newW),
        Math.round(newH)
      );
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.dragging = null;
    this.resizing = null;
  }

  asText(el: CanvasElement): TextElement {
    return el as TextElement;
  }

  asImage(el: CanvasElement): ImageElement {
    return el as ImageElement;
  }

  asPhone(el: CanvasElement): PhoneMockupElement {
    return el as PhoneMockupElement;
  }

  getElementStyle(el: CanvasElement): Record<string, string> {
    return {
      position: 'absolute',
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.width}px`,
      height: `${el.height}px`,
      zIndex: `${el.zIndex}`,
      transform: `rotate(${el.rotation}deg)`,
    };
  }

  getTextStyle(el: TextElement): Record<string, string> {
    return {
      fontFamily: `'${el.fontFamily}', sans-serif`,
      fontSize: `${el.fontSize}px`,
      fontWeight: el.fontWeight,
      fontStyle: el.fontStyle,
      color: el.color,
      backgroundColor: el.backgroundColor,
      padding: `${el.padding}px`,
      borderRadius: `${el.borderRadius}px`,
      textAlign: el.textAlign,
      width: '100%',
      height: '100%',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      lineHeight: '1.15',
      display: 'flex',
      alignItems: 'center',
      justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
      boxSizing: 'border-box',
    };
  }
}
