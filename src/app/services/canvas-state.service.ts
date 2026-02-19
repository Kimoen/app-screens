import { Injectable, signal, computed, effect } from '@angular/core';
import {
  CanvasState,
  CanvasElement,
  TextElement,
  ImageElement,
  PhoneMockupElement,
  BannerElement,
  createDefaultState,
  generateId,
} from '../models/canvas-element.model';

const STORAGE_KEY = 'app-screens-data';
const MAX_HISTORY = 50;

function loadFromStorage(): { tabs: CanvasState[]; activeIndex: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data.tabs) && data.tabs.length > 0) {
      return { tabs: data.tabs, activeIndex: data.activeIndex ?? 0 };
    }
  } catch { /* ignore corrupt data */ }
  return null;
}

@Injectable({ providedIn: 'root' })
export class CanvasStateService {
  private tabs = signal<CanvasState[]>([createDefaultState()]);
  private activeTabIndex = signal<number>(0);

  // History
  private past = signal<{ tabs: CanvasState[]; activeIndex: number }[]>([]);
  private future = signal<{ tabs: CanvasState[]; activeIndex: number }[]>([]);
  private ignoreHistory = false;

  readonly activeTabIdx = this.activeTabIndex.asReadonly();
  readonly allTabs = this.tabs.asReadonly();
  readonly canUndo = computed(() => this.past().length > 0);
  readonly canRedo = computed(() => this.future().length > 0);

  constructor() {
    const saved = loadFromStorage();
    if (saved) {
      this.tabs.set(saved.tabs);
      this.activeTabIndex.set(Math.min(saved.activeIndex, saved.tabs.length - 1));
    }

    effect(() => {
      const data = { tabs: this.tabs(), activeIndex: this.activeTabIndex() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
  }

  // The "current" state is now computed from the active tab
  readonly state = computed(() => this.tabs()[this.activeTabIndex()]);

  readonly canvasState = this.state; // Alias for compatibility if needed, but 'state' is now a computed signal
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

  // --- Tab Management ---

  addTab() {
    this.pushHistory();
    this.tabs.update(tabs => [...tabs, createDefaultState()]);
    // Switch to the new tab
    this.activeTabIndex.set(this.tabs().length - 1);
  }

  removeTab(index: number) {
    if (this.tabs().length <= 1) return; // Don't remove the last tab
    this.pushHistory();

    this.tabs.update(tabs => tabs.filter((_, i) => i !== index));

    // Adjust active index if needed
    if (this.activeTabIndex() >= index) {
      this.activeTabIndex.update(i => Math.max(0, i - 1));
    }
  }

  setActiveTab(index: number) {
    if (index >= 0 && index < this.tabs().length) {
      this.activeTabIndex.set(index);
    }
  }

  // --- Undo / Redo ---

  undo() {
    const past = this.past();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    // Current state becomes future
    this.future.update(f => [{ tabs: this.tabs(), activeIndex: this.activeTabIndex() }, ...f]);

    // Restore previous
    this.ignoreHistory = true;
    this.tabs.set(previous.tabs);
    this.activeTabIndex.set(previous.activeIndex);
    this.ignoreHistory = false;

    this.past.set(newPast);
  }

  redo() {
    const future = this.future();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    // Current state becomes past
    this.past.update(p => [...p, { tabs: this.tabs(), activeIndex: this.activeTabIndex() }]);

    // Restore next
    this.ignoreHistory = true;
    this.tabs.set(next.tabs);
    this.activeTabIndex.set(next.activeIndex);
    this.ignoreHistory = false;

    this.future.set(newFuture);
  }

  public pushHistory() {
    if (this.ignoreHistory) return;

    const current = { tabs: this.tabs(), activeIndex: this.activeTabIndex() };
    this.past.update(p => {
      const newPast = [...p, current];
      if (newPast.length > MAX_HISTORY) {
        return newPast.slice(newPast.length - MAX_HISTORY);
      }
      return newPast;
    });
    this.future.set([]);
  }

  // --- State Updates (Always target active tab) ---

  private updateActiveState(updater: (s: CanvasState) => CanvasState, skipHistory = false) {
    if (!skipHistory) this.pushHistory();
    this.tabs.update(tabs => {
      const idx = this.activeTabIndex();
      const newTabs = [...tabs];
      newTabs[idx] = updater(newTabs[idx]);
      return newTabs;
    });
  }

  // Screen mode
  setScreenMode(mode: 1 | 2 | 3) {
    this.updateActiveState((s) => ({ ...s, screenMode: mode }));
  }

  // Background
  setBackgroundType(type: 'solid' | 'gradient') {
    this.updateActiveState((s) => ({ ...s, backgroundType: type }));
  }
  setBackgroundColor(color: string) {
    this.updateActiveState((s) => ({ ...s, backgroundColor: color }));
  }
  setGradientStart(color: string) {
    this.updateActiveState((s) => ({ ...s, gradientStart: color }));
  }
  setGradientEnd(color: string) {
    this.updateActiveState((s) => ({ ...s, gradientEnd: color }));
  }
  setGradientAngle(angle: number) {
    this.updateActiveState((s) => ({ ...s, gradientAngle: angle }));
  }

  // Selection
  selectElement(id: string | null) {
    this.updateActiveState((s) => ({ ...s, selectedElementId: id }), true);
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
    this.updateActiveState((s) => ({
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
    this.updateActiveState((s) => ({
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
      frameType: 'original',
      frameColor: '#1c1c1e',
    };
    this.updateActiveState((s) => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
    }));
    return el;
  }

  addBanner(content?: string): BannerElement {
    const el: BannerElement = {
      id: generateId(),
      type: 'banner',
      x: 90,
      y: 100,
      width: 900,
      height: 120,
      rotation: 0,
      zIndex: this.state().elements.length + 1,
      content: content ?? 'Titre',
      fontFamily: 'Poppins',
      fontSize: 48,
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#ffffff',
      textAlign: 'center',
      padding: 16,
      bgType: 'gradient',
      bgColor: '#6366f1',
      gradientStart: '#6366f1',
      gradientEnd: '#a855f7',
      gradientAngle: 90,
      borderEnabled: true,
      borderColor: '#ffffff40',
      borderWidth: 2,
      borderRadius: 12,
      skewX: 0,
    };
    this.updateActiveState((s) => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
    }));
    return el;
  }

  // Update element
  updateElement(id: string, changes: Partial<CanvasElement>, skipHistory = false) {
    this.updateActiveState((s) => ({
      ...s,
      elements: s.elements.map((el) =>
        el.id === id ? ({ ...el, ...changes } as CanvasElement) : el
      ),
    }), skipHistory);
  }

  // Move element
  moveElement(id: string, x: number, y: number, skipHistory = false) {
    this.updateElement(id, { x, y }, skipHistory);
  }

  // Resize element
  resizeElement(id: string, width: number, height: number, skipHistory = false) {
    this.updateElement(id, { width: Math.max(20, width), height: Math.max(20, height) }, skipHistory);
  }

  // Duplicate element
  duplicateElement(id: string) {
    const el = this.state().elements.find((e) => e.id === id);
    if (!el) return;
    const copy = { ...el, id: generateId(), x: el.x + 30, y: el.y + 30, zIndex: this.state().elements.length + 1 } as CanvasElement;
    this.updateActiveState((s) => ({
      ...s,
      elements: [...s.elements, copy],
      selectedElementId: copy.id,
    }));
  }

  // Delete element
  deleteElement(id: string) {
    this.updateActiveState((s) => ({
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
    this.updateActiveState((s) => ({
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
    this.updateActiveState(() => createDefaultState());
  }
}
