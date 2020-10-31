import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  createIdentity,
  createRotate,
  createScale,
  createSkew,
  createTranslate,
  isIdentity,
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
  @Output() transformChange = new EventEmitter<TransformChangeEvent>();

  preview = false;
  selection: TransformName = 'move';

  translateX = 0;
  translateY = 0;
  scaleFactorX = 100;
  scaleFactorY = 100;
  skewXAngle = 0;
  skewYAngle = 0;
  rotateAngle = 0;
  rotateX = 0;
  rotateY = 0;
  matrix = createIdentity();

  shouldScaleProportionally = false;

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

  setScale(x: number, y: number) {
    if (x !== this.scaleFactorX || y !== this.scaleFactorY) {
      this.scaleFactorX = x;
      this.scaleFactorY = y;
      this.updatePreview();
    }
  }

  setSkew(x: number, y: number) {
    if (x !== this.skewXAngle || y !== this.skewYAngle) {
      this.skewXAngle = x;
      this.skewYAngle = y;
      this.updatePreview();
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

  setMatrix(name: string, value: number) {
    if (name in this.matrix && this.matrix[name] !== value) {
      this.matrix[name] = value;
      this.updatePreview();
    }
  }

  emitTransform() {
    this.preview = false;
    this.transformChange.emit({ transformName: this.selection, matrix: this.getSelectedMatrix() });
  }

  emitPreview() {
    const matrix = this.preview ? this.getSelectedMatrix() : undefined;
    this.transformChange.emit({ transformName: this.selection, matrix, preview: true });
  }

  getSelectedMatrix(): Matrix {
    switch (this.selection) {
      case 'move': return createTranslate(this.translateX, this.translateY);
      case 'scale': return createScale(this.scaleFactorX / 100, this.scaleFactorY / 100);
      case 'skew': return createSkew(this.skewXAngle * Math.PI / 180, this.skewYAngle * Math.PI / 180);
      case 'rotate': if (this.rotateX !== 0 || this.rotateY !== 0) {
        return multiply(
          multiply(createTranslate(this.rotateX, this.rotateY), createRotate(+this.rotateAngle * Math.PI / 180)),
          createTranslate(-this.rotateX, -this.rotateY));
      } else {
        return createRotate(this.rotateAngle * Math.PI / 180);
      }
    }
    return { ...this.matrix };
  }

  setScaleProportionally(value: boolean) {
    this.shouldScaleProportionally = value;
    if (value) {
      this.setScale(this.scaleFactorX, this.scaleFactorX);
    }
  }

  addTransform() {
    this.matrix = multiply(this.matrix, this.getSelectedMatrix());
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
        this.setScale(100, 100);
        break;
      case 'skew':
        this.setSkew(0, 0);
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
