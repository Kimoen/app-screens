export interface BuiltinImage {
  nameKey: string;
  src: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const BUILTIN_IMAGES: BuiltinImage[] = [
  {
    nameKey: 'builtin.handTouch',
    src: 'images/hand-touch.png',
    defaultWidth: 300,
    defaultHeight: 300,
  },
];
