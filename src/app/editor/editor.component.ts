import { Component, ViewChild, inject, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { ExportService } from '../services/export.service';
import { CanvasStateService } from '../services/canvas-state.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, CanvasComponent, ToolbarComponent, PropertiesPanelComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit {
  private exportService = inject(ExportService);
  private canvasState = inject(CanvasStateService);

  @ViewChild(CanvasComponent) canvasComponent!: CanvasComponent;
  @ViewChild('canvasArea', { static: true }) canvasArea!: ElementRef<HTMLDivElement>;

  canvasScale = 0.35;
  canvasWidth = this.canvasState.canvasWidth;

  ngAfterViewInit() {
    setTimeout(() => this.computeScale(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.computeScale();
  }

  computeScale() {
    const area = this.canvasArea?.nativeElement;
    if (!area) return;
    const availW = area.clientWidth - 40;
    const availH = area.clientHeight - 40;
    const scaleW = availW / this.canvasWidth();
    const scaleH = availH / 1920;
    this.canvasScale = Math.min(scaleW, scaleH, 0.6);
  }

  async onExport() {
    const canvasEl = this.canvasComponent.canvasElement;
    const width = this.canvasWidth();
    const screenMode = this.canvasState.screenMode();
    await this.exportService.exportAsPng(canvasEl, width, 1920, screenMode);
  }
}
