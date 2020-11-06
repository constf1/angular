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
  scaleX = 0;
  scaleY = 0;
  scaleProportionally = false;
  skewXAngle = 0;
  skewYAngle = 0;
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
      case 'scale':
        if (this.scaleX !== 0 || this.scaleY !== 0) {
          // transform="translate(cx, cy) scale(sx, sy) translate(-cx, -cy)"
          return multiply(createTranslate(this.scaleX, this.scaleY),
            multiply(createScale(this.scaleFactorX / 100, this.scaleFactorY / 100), createTranslate(-this.scaleX, -this.scaleY)));
        } else {
          return createScale(this.scaleFactorX / 100, this.scaleFactorY / 100);
        }
      case 'skew': return createSkew(this.skewXAngle * Math.PI / 180, this.skewYAngle * Math.PI / 180);
      case 'rotate': if (this.rotateX !== 0 || this.rotateY !== 0) {
        // transform="translate(cx, cy) rotate(deg) translate(-cx, -cy)"
        return multiply(createTranslate(this.rotateX, this.rotateY),
          multiply(createRotate(this.rotateAngle * Math.PI / 180), createTranslate(-this.rotateX, -this.rotateY)));
      } else {
        return createRotate(this.rotateAngle * Math.PI / 180);
      }
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
    this.matrix = multiply(this.getSelectedMatrix(), this.matrix);
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
