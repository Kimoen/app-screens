export interface BaseCanvasElement {
  id: string;
  type: 'text' | 'image' | 'phone-mockup';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface TextElement extends BaseCanvasElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain' | 'fill';
  opacity: number;
}

export interface PhoneMockupElement extends BaseCanvasElement {
  type: 'phone-mockup';
  screenshotSrc: string;
  borderEnabled: boolean;
  borderColor: string;
  borderWidth: number;
  glowEnabled: boolean;
  glowColor: string;
  glowSize: number;
}

export type CanvasElement = TextElement | ImageElement | PhoneMockupElement;

export interface CanvasState {
  width: number;
  height: number;
  screenMode: 1 | 2 | 3;
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  elements: CanvasElement[];
  selectedElementId: string | null;
}

export function createDefaultState(): CanvasState {
  return {
    width: 1080,
    height: 1920,
    screenMode: 1,
    backgroundType: 'gradient',
    backgroundColor: '#1a1a2e',
    gradientStart: '#0f0c29',
    gradientEnd: '#302b63',
    gradientAngle: 180,
    elements: [],
    selectedElementId: null,
  };
}

let nextId = 1;
export function generateId(): string {
  return `el-${nextId++}-${Date.now()}`;
}
