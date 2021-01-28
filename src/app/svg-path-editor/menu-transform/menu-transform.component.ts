import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Direction, getPointAt, Rect } from 'src/app/common/math2d';
import {
  createIdentity,
  createRotate,
  createRotateAt,
  createScale,
  createScaleAt,
  createSkew,
  createSkewAt,
  createTranslate,
  isIdentity,
  isValid,
  Matrix,
  multiply
} from 'src/app/common/matrix-math';

export const TRANSFORMS = {
  move: 'Move',
  scale: 'Scale',
  rotate: 'Rotate',
  skew: 'Skew',
  matrix: 'Matrix',
} as const;

export type TransformName = keyof typeof TRANSFORMS;

export interface TransformChangeEvent {
  transformName: TransformName;
  matrix?: Matrix;
  preview?: boolean;
}

@Component({
  selector: 'app-menu-transform',
  templateUrl: './menu-transform.component.html',
  styleUrls: ['./menu-transform.component.scss']
})
export class MenuTransformComponent implements OnInit {
  @Input() boundingRect: Rect | undefined;
  @Output() transformChange = new EventEmitter<TransformChangeEvent>();

  preview = false;
  selection: TransformName = 'move';

  translateX = 0;
  translateY = 0;
  scaleFactorX = 100;
  scaleFactorY = 100;
  scaleX = 0;
  scaleY = 0;
  scaleProportionally = false;
  skewXAngle = 0;
  skewYAngle = 0;
  skewX = 0;
  skewY = 0;
  rotateAngle = 0;
  rotateX = 0;
  rotateY = 0;
  matrix = createIdentity();

  readonly transforms = TRANSFORMS;
  readonly transformNames = Object.keys(TRANSFORMS);
  readonly matrixNames = Object.keys(this.matrix);

  constructor() { }

  ngOnInit(): void {
  }

  updatePreview() {
    if (this.preview) {
      this.emitPreview();
    }
  }

  setSelection(value: TransformName) {
    if (value !== this.selection) {
      this.selection = value;
      this.updatePreview();
    }
  }

  setTranslate(x: number, y: number) {
    if (x !== this.translateX || y !== this.translateY) {
      this.translateX = x;
      this.translateY = y;
      this.updatePreview();
    }
  }

  setScale(xScale: number, yScale: number, x: number, y: number) {
    if (xScale !== this.scaleFactorX || yScale !== this.scaleFactorY || x !== this.scaleX || y !== this.scaleY) {
      this.scaleFactorX = xScale;
      this.scaleFactorY = yScale;
      this.scaleX = x;
      this.scaleY = y;
      this.updatePreview();
    }
  }

  setScaleOrigin(direction: Direction) {
    if (this.boundingRect) {
      const point = getPointAt(this.boundingRect, direction);
      this.setScale(this.scaleFactorX, this.scaleFactorY, point.x, point.y);
    }
  }

  setSkew(xAngle: number, yAngle: number, x: number, y: number) {
    if (xAngle !== this.skewXAngle || yAngle !== this.skewYAngle || x !== this.skewX || y !== this.skewY) {
      this.skewXAngle = xAngle;
      this.skewYAngle = yAngle;
      this.skewX = x;
      this.skewY = y;
      this.updatePreview();
    }
  }

  setSkewOrigin(direction: Direction) {
    if (this.boundingRect) {
      const point = getPointAt(this.boundingRect, direction);
      this.setSkew(this.skewXAngle, this.skewYAngle, point.x, point.y);
    }
  }

  setRotate(angle: number, x: number, y: number) {
    if (angle !== this.rotateAngle || x !== this.rotateX || y !== this.rotateY) {
      this.rotateAngle = angle;
      this.rotateX = x;
      this.rotateY = y;
      this.updatePreview();
    }
  }

  setRotateOrigin(direction: Direction) {
    if (this.boundingRect) {
      const point = getPointAt(this.boundingRect, direction);
      this.setRotate(this.rotateAngle, point.x, point.y);
    }
  }

  setMatrix(name: string, value: number) {
    if (name in this.matrix && this.matrix[name] !== value) {
      this.matrix[name] = value;
      this.updatePreview();
    }
  }

  emitTransform() {
    const matrix = this.getSelectedMatrix();
    if (isValid(matrix)) {
      this.preview = false;
      this.transformChange.emit({ transformName: this.selection, matrix });
    }
  }

  emitPreview() {
    let matrix: Matrix | undefined;
    if (this.preview) {
      const m = this.getSelectedMatrix();
      if (isValid(m)) {
        matrix = m;
      }
    }
    this.transformChange.emit({ transformName: this.selection, matrix, preview: true });
  }

  getSelectedMatrix(): Matrix {
    switch (this.selection) {
      case 'move': return createTranslate(this.translateX, this.translateY);
      case 'scale':
        return (this.scaleX || this.scaleY)
            ? createScaleAt(this.scaleFactorX / 100, this.scaleFactorY / 100, this.scaleX, this.scaleY)
            : createScale(this.scaleFactorX / 100, this.scaleFactorY / 100);
      case 'skew': return (this.skewX || this.skewY)
            ? createSkewAt(this.skewXAngle * Math.PI / 180, this.skewYAngle * Math.PI / 180, this.skewX, this.skewY)
            : createSkew(this.skewXAngle * Math.PI / 180, this.skewYAngle * Math.PI / 180);
      case 'rotate':
        return (this.rotateX || this.rotateY)
          ? createRotateAt(this.rotateAngle * Math.PI / 180, this.rotateX, this.rotateY)
          : createRotate(this.rotateAngle * Math.PI / 180);
    }
    return { ...this.matrix };
  }

  setScaleProportionally(value: boolean) {
    this.scaleProportionally = value;
    if (value) {
      this.setScale(this.scaleFactorX, this.scaleFactorX, this.scaleX, this.scaleY);
    }
  }

  addTransform() {
    const m = multiply(this.getSelectedMatrix(), this.matrix);
    if (isValid(m)) {
      this.matrix = m;
    }
    if (this.selection !== 'matrix') {
      this.setSelection('matrix');
    } else {
      this.updatePreview();
    }
  }

  clearTransform() {
    switch (this.selection) {
      case 'move':
        this.setTranslate(0, 0);
        break;
      case 'scale':
        this.setScale(100, 100, 0, 0);
        break;
      case 'skew':
        this.setSkew(0, 0, 0, 0);
        break;
      case 'rotate':
        this.setRotate(0, 0, 0);
        break;
      default:
        if (!isIdentity(this.matrix)) {
          this.matrix = createIdentity();
          this.updatePreview();
        }
    }
  }

  togglePreview() {
    this.preview = !this.preview;
    this.emitPreview();
  }
}
