// tslint:disable: variable-name
import { Component, OnInit, Renderer2 } from '@angular/core';

// app/common
import { DragListener } from 'src/app/common/drag-listener';
import { UnsubscribableComponent } from 'src/app/common/unsubscribable-component';

import { PathModel, Point } from '../path-model';
import { EditorSettingsService } from '../services/editor-settings.service';

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix
//
// | R_ |     | r1 r2 r3 r4 r5 |   | R |
// | G_ |     | g1 g2 g3 g4 g5 |   | G |
// | B_ |  =  | b1 b2 b3 b4 b5 | * | B |
// | A_ |     | a1 a2 a3 a4 a5 |   | A |
// | 1  |     | 0  0  0  0  1  |   | 1 |
//
// R_ = r1*R + r2*G + r3*B + r4*A + r5
// G_ = g1*R + g2*G + g3*B + g4*A + g5
// B_ = b1*R + b2*G + b3*B + b4*A + b5
// A_ = a1*R + a2*G + a3*B + a4*A + a5

const FE_COLOR_MATRICES = {
  identity: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0',
  red: '1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',
  green: '0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1 0',
  blue: '0 0 0 0 0 0 0 0 0 0 1 1 1 1 0 0 0 0 1 0',
  invert: '-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0',
};

function compact(pathData: string): string {
  // remove spaces:
  return pathData
    .replace(/\s*([MLHVZCSQTA])\s*/gmi, '$1')
    .replace(/\s+(\-)/gmi, '$1');
}

interface DragData {
  point: Point;
  startX: number;
  startY: number;
}

@Component({
  selector: 'app-svg-path-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends UnsubscribableComponent implements OnInit {
  private _dragListener = new DragListener<DragData>();

  pathModel = new PathModel();
  showRawPathInput = true;

  imageData = ''; // image as dataURL
  imageWidth = 100; // in percent
  imageColorMatrixNames = Object.keys(FE_COLOR_MATRICES);
  imageColorMatrixValue = this.imageColorMatrixNames[0];

  get imageColorMatrix() {
    return FE_COLOR_MATRICES[this.imageColorMatrixValue] || FE_COLOR_MATRICES.identity;
  }

  get viewBox(): string {
    const s = this.settings.state;
    return `${s.xOffset} ${s.yOffset} ${s.width} ${s.height}`;
  }

  constructor(public settings: EditorSettingsService, private _renderer2: Renderer2) {
    super();
  }

  getGroups() {
    const groups: { group: string[], startIndex: number }[] = [];
    let startIndex = 0;
    for (const group of this.pathModel.getGroups()) {
      groups.push({ group, startIndex });
      startIndex += group.length;
    }
    return groups;
  }

  setShowRawPathInput(value: boolean) {
    this.showRawPathInput = value;
    // Clear any previously selected items. It's a design feature. NOT a bug!
    this.pathModel.clearSelection();
  }

  onSelectionChange(startIndex: number, items: boolean[]) {
    for (let i = items.length; i-- > 0;) {
      this.pathModel.select(startIndex + i, items[i]);
    }
  }

  // selectNext(event: KeyboardEvent) {
  //   if (this.selectedNode + 1 < this.pathModel.nodes.length) {
  //     event.preventDefault();
  //     this.selectedNode = this.selectedNode + 1;
  //   }
  // }

  // selectPrev(event: KeyboardEvent) {
  //   if (this.selectedNode > 0) {
  //     event.preventDefault();
  //     this.selectedNode = this.selectedNode - 1;
  //   }
  // }

  // onKeydown(event) {
  //   console.log('Key:', event);
  // }

  onDragMove() {
    const data = this._dragListener.data;
    const point = data.point;

    const dx = Math.floor(this._dragListener.deltaX);
    const dy = Math.floor(this._dragListener.deltaY);

    const xOffset = data.startX + dx - point.x;
    const yOffset = data.startY + dy - point.y;

    if (xOffset !== 0 || yOffset !== 0) {
      const node = this.pathModel.firstSelection;
      if (node && node.endPoint === point) {
        this.pathModel.moveSelectedNodes({ x: xOffset, y : yOffset });
      } else {
        point.x += xOffset;
        point.y += yOffset;
      }
    }
  }

  onDragEnd() {
    const data = this._dragListener.data;
    const point = data.point;
    if (point.x !== data.startX || point.y !== data.startY) {
      this.settings.set({ pathDataInput: this.pathModel.toString('\n') });
    }
  }

  ngOnInit(): void {
    this._addSubscription(this._dragListener.dragChange.subscribe(event => {
      switch (event) {
        // case 'DragStart':
        //   console.log('DragStart');
        //   break;
        case 'DragMove': this.onDragMove(); break;
        case 'DragStop': this.onDragEnd(); break;
      }
    }));
  }

  controlPointMouseDown(event: MouseEvent, point: Point) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();

    this._dragListener.mouseStart(event, this._renderer2, { point, startX: point.x, startY: point.y });
  }

  convertInput(relative: boolean) {
    this.pathModel.convertTo(relative);
    this.settings.set({ pathDataInput: this.pathModel.toString('\n') });
  }

  compactInput() {
    this.settings.set({ pathDataInput: compact(this.settings.state.pathDataInput) });
  }

  onInputChange(pathDataInput: string) {
    const settings = this.settings;
    if (settings.state.pathDataInput !== pathDataInput) {
      settings.set({ pathDataInput });
      this.pathModel.fromString(pathDataInput);
    }
  }

  loadImage(event: Event) {
    const target = event.target as EventTarget & { files: FileList };
    if (target && target.files[0]) {
      const file: File = target.files[0];
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent) => {
          if (typeof reader.result === 'string') {
            this.imageData = reader.result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
