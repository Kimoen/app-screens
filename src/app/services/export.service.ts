import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas-pro';

@Injectable({ providedIn: 'root' })
export class ExportService {
  async exportAsPng(element: HTMLElement, width: number, height: number): Promise<void> {
    // Clone the element and render it offscreen at full size (no scale transform)
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.transform = 'none';
    clone.style.zIndex = '-1';
    clone.style.overflow = 'hidden';

    // Remove selection outlines and resize handles from the clone
    clone.querySelectorAll('.selected').forEach((el) => {
      (el as HTMLElement).classList.remove('selected');
    });
    clone.querySelectorAll('.resize-handle').forEach((el) => el.remove());

    document.body.appendChild(clone);

    // Small delay to let browser render the clone
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(clone, {
      width,
      height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    document.body.removeChild(clone);

    const link = document.createElement('a');
    link.download = `screenshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
