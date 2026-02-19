import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas-pro';

@Injectable({ providedIn: 'root' })
export class ExportService {
  async exportAsPng(element: HTMLElement, totalWidth: number, height: number, screenMode: 1 | 2 | 3): Promise<void> {
    // Clone the element and render it offscreen at full size (no scale transform)
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = `${totalWidth}px`;
    clone.style.height = `${height}px`;
    clone.style.transform = 'none';
    clone.style.zIndex = '-1';
    clone.style.overflow = 'hidden';

    // Remove selection outlines, resize handles, and split guides from the clone
    clone.querySelectorAll('.selected').forEach((el) => {
      (el as HTMLElement).classList.remove('selected');
    });
    clone.querySelectorAll('.resize-handle').forEach((el) => el.remove());
    clone.querySelectorAll('.split-guide').forEach((el) => el.remove());

    document.body.appendChild(clone);

    // Small delay to let browser render the clone
    await new Promise((resolve) => setTimeout(resolve, 100));

    const fullCanvas = await html2canvas(clone, {
      width: totalWidth,
      height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    document.body.removeChild(clone);

    const sliceWidth = 1080;
    const timestamp = Date.now();

    for (let i = 0; i < screenMode; i++) {
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = sliceWidth;
      sliceCanvas.height = height;
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(fullCanvas, i * sliceWidth, 0, sliceWidth, height, 0, 0, sliceWidth, height);

      const link = document.createElement('a');
      link.download = screenMode === 1
        ? `screenshot-${timestamp}.png`
        : `screenshot-${timestamp}-${i + 1}.png`;
      link.href = sliceCanvas.toDataURL('image/png');
      link.click();

      // Small delay between downloads to avoid browser blocking
      if (i < screenMode - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }
}
