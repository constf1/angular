// tslint:disable: variable-name
import { Component, OnInit, Renderer2 } from '@angular/core';

// app/common
import { DragListener } from 'src/app/common/drag-listener';
import { UnsubscribableComponent } from 'src/app/common/unsubscribable-component';

import { PathModel, Point } from '../path-model';
import { EditorSettingsService } from '../services/editor-settings.service';
import { PathDataService } from '../services/path-data.service';

const SAMPLE_PATH_DATA =
'm205 698c-17-194 169-280 169-408s-24-259 127-274s177 84 174 243s218 217 164 452c43 15 31 74 55 97'
+ 's50 71-18 97s-75 47-107 77s-129 64-154-28c-45 7-47-8-95-7s-59 10-108 13c-35 78-151 26-174 13'
+ 's-94-9-124-25s-23-52-12-83s-26-87 30-107s40-29 73-60zm-9 30c-20 39-66 34-76 51s-12 23-4 64'
+ 's-18 40-7 78s104 16 156 50s139 24 141-36s-70-102-90-157s-74-120-120-50zm103-60'
+ 'c-56-80 35-193 26-195s-63 84-59 160s86 96 111 126s59 83-4 85q20 22 31 40a150 100-8 00 217-10'
+ 'c33-30 4-182 71-192c-4-74 116-10 116 7s4 21 10 16s12-38-59-66c20-83-54-183-71-182s85 65 51 175'
+ 'q-9-4-22-3c-21-119-82-163-117-316q-12 18-37 30t-30 15q-55 33-90 4t-40-28c-5 121-100 220-104 334'
+ 'zm390 28c-44 17-26 115-47 172s-23 102 16 124s80 6 119-34s68-55 102-69q57-20 4-74'
+ 'c-30-41-15-64-32-82s-28-14-50-12q-88 76-112-25zm9-3c12 73 93 20 85-3s-89-65-85 3m-100-403'
+ 'c-5-29-46-27-77-47s-66-11-84 6s-48 34-48 50s16 25 43 45s41 39 90 11s79-30 76-65zm-14-29'
+ 'a51 65 2 10-86-34l24 9a23 36 0 11 37 17zm-120-34a38 56-1 10-55 38l15-11a16 28-4 11 18-17z'
+ 'm-61 65c81 80 122 15 173-2v5c-52 27-103 80-174 3z';

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

  pathInput = '';
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

  get pathData() {
    return compact(this.pathModel.toAbsolutePath());
  }

  constructor(
    public settings: EditorSettingsService,
    public history: PathDataService,
    private _renderer2: Renderer2) {
    super();
  }

  setShowRawPathInput(value: boolean) {
    this.showRawPathInput = value;
    // Clear any previously selected items. It's a design feature. NOT a bug!
    this.pathModel.clearSelection();
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
      this.pathInput = this.pathModel.toString('\n');
      this.history.pathData = this.pathData;
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

    this.onInputChange(this.history.pathData || SAMPLE_PATH_DATA);
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
    this.pathInput = this.pathModel.toString('\n');
  }

  compactInput() {
    this.pathInput = compact(this.pathInput);
  }

  onInputChange(pathInput: string) {
    // console.log({ prev: this.pathInput, next: pathInput});
    if (pathInput !== this.pathInput) {
      this.pathInput = pathInput;
      this.pathModel.fromString(pathInput);
      this.history.pathData = this.pathData;
    }
  }

  onUndo() {
    if (this.history.canUndo) {
      this.history.undo();
      this.onInputChange(this.history.pathData);
    }
  }

  onRedo() {
    if (this.history.canRedo) {
      this.history.redo();
      this.onInputChange(this.history.pathData);
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
