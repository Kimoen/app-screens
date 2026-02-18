import { Component, ViewChild, inject, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, CanvasComponent, ToolbarComponent, PropertiesPanelComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit {
  private exportService = inject(ExportService);

  @ViewChild(CanvasComponent) canvasComponent!: CanvasComponent;
  @ViewChild('canvasArea', { static: true }) canvasArea!: ElementRef<HTMLDivElement>;

  canvasScale = 0.35;

  ngAfterViewInit() {
    setTimeout(() => this.computeScale(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.computeScale();
  }

  private computeScale() {
    const area = this.canvasArea?.nativeElement;
    if (!area) return;
    const availW = area.clientWidth - 40;
    const availH = area.clientHeight - 40;
    const scaleW = availW / 1080;
    const scaleH = availH / 1920;
    this.canvasScale = Math.min(scaleW, scaleH, 0.6);
  }

  async onExport() {
    const canvasEl = this.canvasComponent.canvasElement;
    await this.exportService.exportAsPng(canvasEl, 1080, 1920);
  }
}
