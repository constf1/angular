/* eslint-disable no-underscore-dangle */

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DragListener, DragEvent } from 'src/app/common/drag-listener';
import { addPoint, Rect } from 'src/app/common/math2d';
import { isIdentity, ReadonlyMatrix, getTransformOrigin } from 'src/app/common/matrix-math';

import { BackgroundImageService } from '../services/background-image.service';
import { EditorSettingsService, initialState } from '../services/editor-settings.service';
import { SvgFileService } from '../services/svg-file.service';

import * as Path from '../svg-path/svg-path-item';
import { getCurveControlHandles, getReflectedCurveTangentLines, getReflectedEllipticalArc } from '../svg-path/svg-path-view';

type PathItem = Readonly<Path.PathItem>;
type PathView = Path.PathView;

export type ControlPoint = {
  readonly itemIndex: number;
  readonly item: PathItem;
  readonly type: 'move' | 'curve1' | 'curve2';
  readonly x: number;
  readonly y: number;
};

type ControlDragData = { point: ControlPoint; startX: number; startY: number };

export type ControlDragEvent = ControlDragData & { name: DragEvent; deltaX: number; deltaY: number };

class MoveControlPoint implements ControlPoint {
  readonly type = 'move';

  constructor(readonly itemIndex: number, readonly item: PathItem) { }

  get x() {
    return Path.getX(this.item);
  }

  get y() {
    return Path.getY(this.item);
  }
}

class Curve1ControlPoint implements ControlPoint {
  readonly type = 'curve1';

  constructor(readonly itemIndex: number, readonly item: PathItem & (Path.CurveTo | Path.QCurveTo)) { }

  get x() {
    return this.item.x1;
  }

  get y() {
    return this.item.y1;
  }
}

class Curve2ControlPoint implements ControlPoint {
  readonly type = 'curve2';

  constructor(readonly itemIndex: number, readonly item: PathItem & (Path.CurveTo | Path.SmoothCurveTo)) { }

  get x() {
    return this.item.x2;
  }

  get y() {
    return this.item.y2;
  }
}

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.scss']
})
export class SvgViewComponent implements OnInit, OnDestroy {
  @Input() set pathItems(view: PathView) {
    this._items = view;
    this._createControls();
  }
  @Input() activeItem?: PathItem;
  @Input() previewMatrix?: ReadonlyMatrix;

  @Output() controlDrag = new EventEmitter<ControlDragEvent>();

  @ViewChild('pathRef') pathRef: ElementRef<SVGPathElement>;

  controls: ControlPoint[] = [];

  settingsState = initialState;
  styles: { [key: string]: any } = {};

  get viewBox(): string {
    const s = this.settingsState;
    return `${s.xOffset} ${s.yOffset} ${s.width} ${s.height}`;
  }

  get pathStrokeColor() {
    const s = this.settingsState;
    return s.isPathStroke ? s.pathStrokeColor : 'none';
  }

  get pathFillColor() {
    const s = this.settingsState;
    return s.isPathFill ? s.pathFillColor : 'none';
  }

  get pathSelectionColor() {
    const s = this.settingsState;
    return s.controlPointsFillColor;
  }

  get pathData() {
    return this.format(this._items);
  }

  get pathSelectionData() {
    const nodes: Readonly<Path.DrawTo>[] = [];
    for (const node of this._items) {
      if (node.selected) {
        const prev = node.prev;
        const prevNotSelected = !(prev?.selected);
        if (prevNotSelected) {
          nodes.push({ name: 'M', x: Path.getX(prev), y: Path.getY(prev) });
        }

        if (prevNotSelected && Path.isSmoothCurveTo(node)) {
          nodes.push({ ...node, name: 'C', x1: Path.getReflectedX1(node), y1: Path.getReflectedY1(node) });
        } else if (prevNotSelected && Path.isSmoothQCurveTo(node)) {
          nodes.push({ ...node, name: 'Q', x1: Path.getReflectedX1(node), y1: Path.getReflectedY1(node) });
        } else if (Path.isClosePath(node) || Path.isMoveTo(node)) {
          nodes.push({ name: 'L', x: Path.getX(node), y: Path.getY(node) });
        } else {
          nodes.push(node);
        }
      }
    }
    return this.format(nodes);
  }

  get pathPreviewData() {
    const m = this.previewMatrix;
    if (m && !isIdentity(m)) {
      return this.format(Path.createTransformed(this._items, m));
    }
    return '';
  }

  get pathTransformOrigin() {
    let path = '';
    if (this.previewMatrix) {
      const origin = getTransformOrigin(this.previewMatrix);
      if (origin) {
        const s = this.settingsState;

        // Add a vertical line.
        if (isFinite(origin.x)) {
          path += `M${origin.x} ${s.yOffset}v${s.height}`;
        }

        // Add a horizontal line.
        if (isFinite(origin.y)) {
          path += `M${s.xOffset} ${origin.y}h${s.width}`;
        }
      }
    }
    return path;
  }

  get pathDragData() {
    if (this._dragListener.isDragging) {
      const { startX, startY } = this._dragListener.data;
      const { x, y } = this._dragListener.data.point;
      if (startX !== x || startY !== y) {
        return `M${startX} ${startY}L${x} ${y}m-3 0h6m-3-3v6`;
      }
    }
    return '';
  }

  get backgroundImageVisibility() {
    const s = this.settingsState;
    return s.isBackgroundImageHidden ? 'hidden' : 'visible';
  }

  get backgroundImageZoom() {
    const s = this.settingsState;
    return `${s.backgroundImageZoom}%`;
  }

  get curveControlHandles() {
    return this._items
      .filter(node => (Path.isCurveTo(node) || Path.isSmoothCurveTo(node) || Path.isQCurveTo(node)))
      .map(getCurveControlHandles)
      .join('');
  }

  get reflectedControlHandles() {
    return this.getReflectedCurveTangentLines() + this.getReflectedEllipticalArcs();
  }

  get isDragging() {
    return this._dragListener.isDragging;
  }

  get boundingRect(): Rect {
    const elem = this.pathRef.nativeElement;
    if (elem && typeof elem.getBBox === 'function') {
      const svgRect: SVGRect = elem.getBBox();
      return { left: svgRect.x, top: svgRect.y, right: svgRect.x + svgRect.width, bottom: svgRect.y + svgRect.height };
    }
    return Path.getBoundingRect(Path.createFromString(this.pathData));
  }

  private _dragListener = new DragListener<ControlDragData>();
  private _subscriptions: Subscription[] = [];
  private _items: PathView = [];

  constructor(
    public settings: EditorSettingsService,
    public background: BackgroundImageService,
    private _archive: SvgFileService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(this.settings.subscribe(state => {
      this.settingsState = state;
      this.styles = {
        width: `${(state.width * state.zoom / 100).toFixed(2)}px`,
        height: `${(state.height * state.zoom / 100).toFixed(2)}px`,
        // scale is slow!
        // transform: `scale(${state.zoom / 100})`,
        'background-color': state.backgroundColor,
      };
    }));

    this._subscriptions.push(this._dragListener.dragChange.subscribe(event => {
      const data = this._dragListener.data;
      const zoom = this.settingsState.zoom;

      const deltaX = data.startX + Math.round(this._dragListener.pageDeltaX * 100 / zoom) - data.point.x;
      const deltaY = data.startY + Math.round(this._dragListener.pageDeltaY * 100 / zoom) - data.point.y;
      this.controlDrag.emit({ ...data, name: event, deltaX, deltaY });
    }));
  }

  ngOnDestroy(): void {
    this._dragListener.stop();

    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
    this._subscriptions.length = 0;
  }

  controlPointMouseDown(event: MouseEvent, index: number) {
    if (event.button !== 0) {
      return;
    }

    const point = this.controls[index];
    this._dragListener.mouseStart(event, this._renderer2, { point, startX: point.x, startY: point.y });
  }

  onTouchStart(event: TouchEvent, frame: SVGElement) {
    if (frame && event.targetTouches.length > 0) {
      const touch = event.targetTouches[0];
      const rc = frame.getBoundingClientRect();
      const index = this.getControlPointIndex(touch.clientX - rc.left, touch.clientY - rc.top);
      if (index >= 0) {
        const point = this.controls[index];
        this._dragListener.touchStart(event, { point, startX: point.x, startY: point.y });
      }
    }
  }

  onTouchStop(event: TouchEvent) {
    if (this._dragListener.isTouchDragging) {
      this._dragListener.stop(event);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this._dragListener.isTouchDragging) {
      this._dragListener.touchMove(event);
    }
  }

  getControlPointIndex(clientX: number, clientY: number): number {
    const R = 5;
    const { xOffset, yOffset, zoom } = this.settingsState;
    const x = clientX * 100 / zoom + xOffset;
    const y = clientY * 100 / zoom + yOffset;

    let index = this.controls.length;
    while (index-- > 0) {
      const control = this.controls[index];
      const dx = control.x - x;
      const dy = control.y - y;
      if (dx * dx + dy * dy <= R * R && this.getVisibility(control.item) === 'visible') {
        break;
      }
    }
    return index;
  }

  trackByIndex(index: number): number {
    return index;
  }

  adjustViewBox(includeControls = false) {
    setTimeout(() => {
      const rc = this.boundingRect;
      if (includeControls) {
        for (const control of this.controls) {
          addPoint(rc, control.x, control.y);
        }
      }

      const pad = this.settings.state.viewBoxPadding;
      const xOffset = Math.floor(rc.left) - pad;
      const yOffset = Math.floor(rc.top) - pad;
      const width = Math.ceil(rc.right) + pad - xOffset;
      const height = Math.ceil(rc.bottom) + pad - yOffset;
      if (width > 0 && height > 0) {
        this.settings.set({ xOffset, yOffset, width, height });
      }
    }, 1);
  }

  toArchive() {
    this._archive.next(this.viewBox, this.pathData);
  }

  format(nodes: ReadonlyArray<Readonly<Path.DrawTo>>) {
    const digits = this.settingsState.maximumFractionDigits;
    return nodes.map(node => Path.asString(node, digits)).join('');
  }

  getReflectedEllipticalArcs() {
    return this._items
      .filter(node => Path.isEllipticalArc(node))
      .map(getReflectedEllipticalArc)
      .join('');
  }

  getReflectedCurveTangentLines() {
    return this._items
      .filter(node => (Path.isSmoothCurveTo(node) || Path.isSmoothQCurveTo(node)))
      .map(getReflectedCurveTangentLines)
      .join('');
  }

  getVisibility(item: PathItem) {
    return (this.activeItem && this.activeItem !== item) ? 'hidden' : 'visible';
  }

  private _createControls() {
    const points: ControlPoint[] = [];

    for (let i = 0; i < this._items.length; i++) {
      const node = this._items[i];
      if (Path.hasControlPoint1(node)) {
        points.push(new Curve1ControlPoint(i, node));
      }
      if (Path.hasControlPoint2(node)) {
        points.push(new Curve2ControlPoint(i, node));
      }
      if (!Path.isClosePath(node)) {
        points.push(new MoveControlPoint(i, node));
      }
    }
    this.controls = points;
  }
}
