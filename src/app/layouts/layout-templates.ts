import { CanvasElement, TextElement, PhoneMockupElement, generateId } from '../models/canvas-element.model';

export interface LayoutTemplate {
  name: string;
  description: string;
  bgType: 'solid' | 'gradient';
  bgColor: string;
  gradStart: string;
  gradEnd: string;
  gradAngle: number;
  createElements: () => CanvasElement[];
}

// S25 phone ratio: width * 2.15 ≈ height (1080x2340 screen + thin bezels)

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    name: 'Texte en haut + Téléphone',
    description: 'Titre accrocheur en haut, téléphone centré en bas',
    bgType: 'gradient',
    bgColor: '#1a1a2e',
    gradStart: '#0f0c29',
    gradEnd: '#302b63',
    gradAngle: 180,
    createElements: () => {
      const text: TextElement = {
        id: generateId(),
        type: 'text',
        x: 60,
        y: 80,
        width: 960,
        height: 300,
        rotation: 0,
        zIndex: 2,
        content: 'Votre titre\naccrocheur ici',
        fontFamily: 'Poppins',
        fontSize: 84,
        fontWeight: '800',
        fontStyle: 'italic',
        color: '#ffffff',
        backgroundColor: '#b388ff80',
        padding: 24,
        borderRadius: 16,
        textAlign: 'center',
      };
      const phone: PhoneMockupElement = {
        id: generateId(),
        type: 'phone-mockup',
        x: 215,
        y: 450,
        width: 650,
        height: 1400,
        rotation: 0,
        zIndex: 1,
        screenshotSrc: '',
      };
      return [phone, text];
    },
  },
  {
    name: 'Téléphone plein + Texte overlay',
    description: 'Téléphone large avec texte superposé en haut',
    bgType: 'gradient',
    bgColor: '#1a1a2e',
    gradStart: '#141e30',
    gradEnd: '#243b55',
    gradAngle: 135,
    createElements: () => {
      const phone: PhoneMockupElement = {
        id: generateId(),
        type: 'phone-mockup',
        x: 165,
        y: 320,
        width: 750,
        height: 1615,
        rotation: 0,
        zIndex: 1,
        screenshotSrc: '',
      };
      const text: TextElement = {
        id: generateId(),
        type: 'text',
        x: 80,
        y: 60,
        width: 920,
        height: 250,
        rotation: 0,
        zIndex: 2,
        content: 'Texte superposé',
        fontFamily: 'Poppins',
        fontSize: 80,
        fontWeight: '700',
        fontStyle: 'normal',
        color: '#ffffff',
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 0,
        textAlign: 'center',
      };
      return [phone, text];
    },
  },
  {
    name: 'Téléphone décalé + Texte latéral',
    description: 'Téléphone à droite, texte à gauche verticalement centré',
    bgType: 'gradient',
    bgColor: '#1a1a2e',
    gradStart: '#1f1c2c',
    gradEnd: '#928dab',
    gradAngle: 160,
    createElements: () => {
      const phone: PhoneMockupElement = {
        id: generateId(),
        type: 'phone-mockup',
        x: 400,
        y: 360,
        width: 650,
        height: 1400,
        rotation: 0,
        zIndex: 1,
        screenshotSrc: '',
      };
      const text: TextElement = {
        id: generateId(),
        type: 'text',
        x: 40,
        y: 100,
        width: 500,
        height: 350,
        rotation: 0,
        zIndex: 2,
        content: 'Titre\ncôté\ngauche',
        fontFamily: 'Poppins',
        fontSize: 76,
        fontWeight: '800',
        fontStyle: 'normal',
        color: '#ffffff',
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 0,
        textAlign: 'left',
      };
      return [phone, text];
    },
  },
];
