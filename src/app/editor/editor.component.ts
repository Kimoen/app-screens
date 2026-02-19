import { Component, ViewChild, inject, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { HeaderComponent } from '../header/header.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ExportService } from '../services/export.service';
import { CanvasStateService } from '../services/canvas-state.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, CanvasComponent, ToolbarComponent, PropertiesPanelComponent, HeaderComponent, TranslatePipe, ConfirmModalComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit {
  private exportService = inject(ExportService);
  private canvasState = inject(CanvasStateService);
  private i18n = inject(TranslationService);

  confirmModal: { message: string; onConfirm: () => void } | null = null;

  @ViewChild(CanvasComponent) canvasComponent!: CanvasComponent;
  @ViewChild(ToolbarComponent) toolbarComponent!: ToolbarComponent;
  @ViewChild('canvasArea', { static: true }) canvasArea!: ElementRef<HTMLDivElement>;

  private readonly ZOOM_STEP = 0.05;
  private readonly ZOOM_MIN = 0.1;
  private readonly ZOOM_MAX = 1;

  canvasScale = 0.35;
  private fitScale = 0.35;
  canvasWidth = this.canvasState.canvasWidth;

  tabs = this.canvasState.allTabs;
  activeTabIdx = this.canvasState.activeTabIdx;

  ngAfterViewInit() {
    setTimeout(() => this.computeScale(), 0);
  }

  onAddTab() {
    this.canvasState.addTab();
    // Scroll to the new tab? Or just let angular handle it.
  }

  onRemoveTab(index: number, event: Event) {
    event.stopPropagation();
    this.confirmModal = {
      message: this.i18n.t('confirm.deleteTab'),
      onConfirm: () => {
        this.canvasState.removeTab(index);
        this.confirmModal = null;
      },
    };
  }

  onClearAllRequested() {
    this.confirmModal = {
      message: this.i18n.t('confirm.clearAll'),
      onConfirm: () => {
        this.canvasState.clearAll();
        this.toolbarComponent.resetToolbarBgState();
        this.confirmModal = null;
      },
    };
  }

  onConfirmCancel() {
    this.confirmModal = null;
  }

  onSelectTab(index: number) {
    this.canvasState.setActiveTab(index);
  }

  @HostListener('window:resize')
  onResize() {
    this.computeScale();
  }

  get zoomPercent(): number {
    return Math.round(this.canvasScale * 100);
  }

  computeScale() {
    const area = this.canvasArea?.nativeElement;
    if (!area) return;
    const availW = area.clientWidth - 40;
    const availH = area.clientHeight - 40;
    const scaleW = availW / this.canvasWidth();
    const scaleH = availH / 1920;
    this.fitScale = Math.min(scaleW, scaleH, 0.6);
    this.canvasScale = this.fitScale;
  }

  zoomIn() {
    this.canvasScale = Math.min(this.canvasScale + this.ZOOM_STEP, this.ZOOM_MAX);
  }

  zoomOut() {
    this.canvasScale = Math.max(this.canvasScale - this.ZOOM_STEP, this.ZOOM_MIN);
  }

  zoomReset() {
    this.computeScale();
  }

  onWheel(event: WheelEvent) {
    if (!event.ctrlKey) return;
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  async onExport() {
    const canvasEl = this.canvasComponent.canvasElement;
    const width = this.canvasWidth();
    const screenMode = this.canvasState.screenMode();
    await this.exportService.exportAsPng(canvasEl, width, 1920, screenMode);
  }

  async onExportAll() {
    const originalIndex = this.activeTabIdx();
    const tabsCount = this.tabs().length;

    for (let i = 0; i < tabsCount; i++) {
      // 1. Select the tab
      this.onSelectTab(i);

      // 2. Wait for Angular to update the view (canvas content)
      // A small delay allows the signal to propagate and the view to re-render
      await new Promise(resolve => setTimeout(resolve, 300));

      // 3. Export
      await this.onExport();

      // 4. Cool down slightly to prevent browser freezing
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Restore original tab
    this.onSelectTab(originalIndex);
  }
}
