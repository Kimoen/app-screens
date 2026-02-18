import { Injectable, signal, computed } from '@angular/core';
import {
  CanvasState,
  CanvasElement,
  TextElement,
  ImageElement,
  PhoneMockupElement,
  createDefaultState,
  generateId,
} from '../models/canvas-element.model';

@Injectable({ providedIn: 'root' })
export class CanvasStateService {
  private state = signal<CanvasState>(createDefaultState());

  readonly canvasState = this.state.asReadonly();
  readonly elements = computed(() => this.state().elements);
  readonly selectedElementId = computed(() => this.state().selectedElementId);
  readonly selectedElement = computed(() => {
    const id = this.state().selectedElementId;
    return this.state().elements.find((e) => e.id === id) ?? null;
  });
  readonly screenMode = computed(() => this.state().screenMode);
  readonly canvasWidth = computed(() => 1080 * this.state().screenMode);

  readonly backgroundStyle = computed(() => {
    const s = this.state();
    if (s.backgroundType === 'solid') {
      return { background: s.backgroundColor };
    }
    return {
      background: `linear-gradient(${s.gradientAngle}deg, ${s.gradientStart}, ${s.gradientEnd})`,
    };
  });

  // Screen mode
  setScreenMode(mode: 1 | 2 | 3) {
    this.state.update((s) => ({ ...s, screenMode: mode }));
  }

  // Background
  setBackgroundType(type: 'solid' | 'gradient') {
    this.state.update((s) => ({ ...s, backgroundType: type }));
  }
  setBackgroundColor(color: string) {
    this.state.update((s) => ({ ...s, backgroundColor: color }));
  }
  setGradientStart(color: string) {
    this.state.update((s) => ({ ...s, gradientStart: color }));
  }
  setGradientEnd(color: string) {
    this.state.update((s) => ({ ...s, gradientEnd: color }));
  }
  setGradientAngle(angle: number) {
    this.state.update((s) => ({ ...s, gradientAngle: angle }));
  }

  // Selection
  selectElement(id: string | null) {
    this.state.update((s) => ({ ...s, selectedElementId: id }));
  }

  // Add elements
  addText(content?: string): TextElement {
    const el: TextElement = {
      id: generateId(),
      type: 'text',
      x: 140,
      y: 100,
      width: 800,
      height: 200,
      rotation: 0,
      zIndex: this.state().elements.length + 1,
      content: content ?? 'Your text here',
      fontFamily: 'Poppins',
      fontSize: 72,
      fontWeight: '800',
      fontStyle: 'normal',
      color: '#ffffff',
      backgroundColor: 'transparent',
      padding: 20,
      borderRadius: 0,
      textAlign: 'center',
    };
    this.state.update((s) => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
    }));
    return el;
  }

  addImage(src: string, naturalWidth: number, naturalHeight: number): ImageElement {
    const maxW = 800;
    const ratio = naturalHeight / naturalWidth;
    const w = Math.min(naturalWidth, maxW);
    const h = w * ratio;
    const el: ImageElement = {
      id: generateId(),
      type: 'image',
      x: (1080 - w) / 2,
      y: (1920 - h) / 2,
      width: w,
      height: h,
      rotation: 0,
      zIndex: this.state().elements.length + 1,
      src,
      objectFit: 'contain',
      opacity: 1,
    };
    this.state.update((s) => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
    }));
    return el;
  }

  addPhoneMockup(screenshotSrc: string = ''): PhoneMockupElement {
    const el: PhoneMockupElement = {
      id: generateId(),
      type: 'phone-mockup',
      x: 215,
      y: 420,
      width: 650,
      height: 1400,
      rotation: 0,
      zIndex: this.state().elements.length + 1,
      screenshotSrc,
      borderEnabled: false,
      borderColor: '#3b82f6',
      borderWidth: 3,
      glowEnabled: false,
      glowColor: '#3b82f6',
      glowSize: 20,
    };
    this.state.update((s) => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
    }));
    return el;
  }

  // Update element
  updateElement(id: string, changes: Partial<CanvasElement>) {
    this.state.update((s) => ({
      ...s,
      elements: s.elements.map((el) =>
        el.id === id ? ({ ...el, ...changes } as CanvasElement) : el
      ),
    }));
  }

  // Move element
  moveElement(id: string, x: number, y: number) {
    this.updateElement(id, { x, y });
  }

  // Resize element
  resizeElement(id: string, width: number, height: number) {
    this.updateElement(id, { width: Math.max(20, width), height: Math.max(20, height) });
  }

  // Delete element
  deleteElement(id: string) {
    this.state.update((s) => ({
      ...s,
      elements: s.elements.filter((el) => el.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
    }));
  }

  // Reorder z-index
  bringToFront(id: string) {
    const maxZ = Math.max(...this.state().elements.map((e) => e.zIndex), 0);
    this.updateElement(id, { zIndex: maxZ + 1 });
  }

  sendToBack(id: string) {
    const minZ = Math.min(...this.state().elements.map((e) => e.zIndex), 0);
    this.updateElement(id, { zIndex: minZ - 1 });
  }

  // Load layout
  loadLayout(elements: CanvasElement[], bgType: 'solid' | 'gradient', bgColor: string, gradStart: string, gradEnd: string, gradAngle: number) {
    this.state.update((s) => ({
      ...s,
      elements,
      backgroundType: bgType,
      backgroundColor: bgColor,
      gradientStart: gradStart,
      gradientEnd: gradEnd,
      gradientAngle: gradAngle,
      selectedElementId: null,
    }));
  }

  clearAll() {
    this.state.set(createDefaultState());
  }
}
