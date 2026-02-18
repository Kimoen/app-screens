export interface BuiltinImage {
  name: string;
  src: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const BUILTIN_IMAGES: BuiltinImage[] = [
  {
    name: 'Main (touch)',
    src: 'images/hand-touch.png',
    defaultWidth: 300,
    defaultHeight: 300,
  },
];
