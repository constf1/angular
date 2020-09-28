// tslint:disable: variable-name
import { Component, OnInit, Renderer2 } from '@angular/core';

// app/common
import { DragListener } from 'src/app/common/drag-listener';
import { UnsubscribableComponent } from 'src/app/common/unsubscribable-component';

import { PathModel, Point } from '../path-model';


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
  private _viewBox = {
    x: 0, y: 0, width: 1024, height: 1024
  };

  private _pathDataInput = '';

  pathModel = new PathModel();

  imageData = ''; // image as dataURL
  imageWidth = 100; // in percent

  isPathStroke = true;
  pathStrokeColor = '#ff00ff';

  isPathFill = false;
  pathFillColor = '#04040f';

  get viewBox(): string {
    const v = this._viewBox;
    return `${v.x} ${v.y} ${v.width} ${v.height}`;
  }

  get x(): number {
    return this._viewBox.x;
  }

  set x(value: number) {
    this._viewBox.x = +value || 0;
  }

  get y(): number {
    return this._viewBox.y;
  }

  set y(value: number) {
    this._viewBox.y = +value || 0;
  }

  get width(): number {
    return this._viewBox.width;
  }

  set width(value: number) {
    this._viewBox.width = +value || 0;
  }

  get height(): number {
    return this._viewBox.height;
  }

  set height(value: number) {
    this._viewBox.height = +value || 0;
  }

  get pathDataInput() {
    return this._pathDataInput;
  }

  set pathDataInput(value: string) {
    if (this._pathDataInput !== value) {
      this._pathDataInput = value;
      this.pathModel.fromString(value);
    }
  }

  constructor(private _renderer2: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this._addSubscription(this._dragListener.dragChange.subscribe(event => {
      switch (event) {
        // case 'DragStart':
        //   console.log('DragStart');
        //   break;
        case 'DragMove':
          // console.log('DragMove', this._dragListener);
          const data = this._dragListener.data;
          const point = data.point;

          const dx = Math.floor(this._dragListener.deltaX);
          const dy = Math.floor(this._dragListener.deltaY);

          point.x = data.startX + dx;
          point.y = data.startY + dy;
          break;
        // case 'DragStop':
        //   console.log('DragStop');
        //   break;
      }
    }));

//     this.pathDataInput = `M540 800l250 52a28 28 0 00 28-44l-56-84 177-44a28 28 0 00 10-49
// l-78-62 90-100a28 28 0 00-24-45l-130-1 4-96  a28 28 0 00-40-31
// l-83 58 34-184a28 28 0 00-42-34l-88 45-52-120a28 28 0 00-54 0
// l-55 121-87-47a28 28 0 00-41 29l 36 191-83-58a28 28 0 00-43 26
// l 7 101-142 0 a28 28 0 00-10 49l 85 97-79 63 a28 28 0 00 16 49
// l 189 45-55 85a28 28 0 00 38 38l 222-50v135  a28 28 0 00 56 0z`;
    this.pathDataInput = `M205 698
c-17-194 169-280 169-408s-24-259 127-274s177 84 174 243s218 217 164 452
c43 15 31 74 55 97s50 71-18 97s-75 47-107 77s-129 64-154-28
c-45 7-47-8-95-7s-59 10-108 13
c-35 78-151 26-174 13s-94-9-124-25s-23-52-12-83s-26-87 30-107s40-29 73-60z
m-9 30
c-20 39-66 34-76 51s-12 23-4 64s-18 40-7 78s104 16 156 50s139 24 141-36s-70-102-90-157s-74-120-120-50z
m103-60
c-56-80 35-193 26-195s-63 84-59 160s86 96 111 126s59 83-4 85
q20 22 31 40
a150 100-8 00 217-10
c33-30 4-182 71-192
c-4-74 116-10 116 7s4 21 10 16s12-38-59-66
c20-83-54-183-71-182s85 65 51 175
q-9-4-22-3
c-21-119-82-163-117-316
q-12 18-37 30t-30 15
q-55 33-90 4t-40-28
c-5 121-100 220-104 334z
m390 28
c-44 17-26 115-47 172s-23 102 16 124s80 6 119-34s68-55 102-69
q57-20 4-74
c-30-41-15-64-32-82s-28-14-50-12
q-88 76-112-25z
m9-3
c12 73 93 20 85-3s-89-65-85 3
m-100-403
c-5-29-46-27-77-47s-66-11-84 6s-48 34-48 50s16 25 43 45s41 39 90 11s79-30 76-65z
m-14-29
a51 65 2 10-86-34l24 9a23 36 0 11 37 17z
m-120-34
a38 56-1 10-55 38l15-11a16 28-4 11 18-17z
m-61 65
c81 80 122 15 173-2v5c-52 27-103 80-174 3z`;
  }

  controlPointMouseDown(event: MouseEvent, point: Point) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();

    this._dragListener.mouseStart(event, this._renderer2, { point, startX: point.x, startY: point.y });
  }

  convertInput(relative?: boolean) {
    this._pathDataInput = this.pathModel.toString(relative, '\n');
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
            // console.log('Loaded:', reader.result.substring(0, 100));
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
