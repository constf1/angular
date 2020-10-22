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
  matrix: Matrix;
}

@Component({
  selector: 'app-menu-transform',
  templateUrl: './menu-transform.component.html',
  styleUrls: ['./menu-transform.component.scss']
})
export class MenuTransformComponent implements OnInit {
  @Output() transformChange = new EventEmitter<TransformChangeEvent>();

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

  applyTransform() {
    this.transformChange.emit({ transformName: this.selection, matrix: this.getSelectedMatrix() });
  }

  getSelectedMatrix(): Matrix {
    switch (this.selection) {
      case 'move': return createTranslate(+this.translateX, +this.translateY);
      case 'scale': return createScale(+this.scaleFactorX / 100, +this.scaleFactorY / 100);
      case 'skew': return createSkew(+this.skewXAngle * Math.PI / 180, +this.skewYAngle * Math.PI / 180);
      case 'rotate': if (this.rotateX !== 0 || this.rotateY !== 0) {
        const dx = +this.rotateX || 0;
        const dy = +this.rotateY || 0;
        return multiply(
          multiply(createTranslate(dx, dy), createRotate(+this.rotateAngle * Math.PI / 180)),
          createTranslate(-dx, -dy));
      } else {
        return createRotate(+this.rotateAngle * Math.PI / 180);
      }
    }
    return { ...this.matrix };
  }

  setScaleX(value: number) {
    this.scaleFactorX = +value || 0;
    if (this.shouldScaleProportionally) {
      this.scaleFactorY = this.scaleFactorX;
    }
  }

  setScaleY(value: number) {
    this.scaleFactorY = +value || 0;
    if (this.shouldScaleProportionally) {
      this.scaleFactorX = this.scaleFactorY;
    }
  }

  setScaleProportionally(value: boolean) {
    this.shouldScaleProportionally = value;
    if (value) {
      this.scaleFactorY = this.scaleFactorX;
    }
  }

  addTransform() {
    this.matrix = multiply(this.matrix, this.getSelectedMatrix());
    this.selection = 'matrix';
  }

  clearTransform() {
    switch (this.selection) {
      case 'move':
        this.translateX = 0;
        this.translateY = 0;
        break;
      case 'scale':
        this.scaleFactorX = 100;
        this.scaleFactorY = 100;
        break;
      case 'skew':
        this.skewXAngle = 0;
        this.skewYAngle = 0;
        break;
      case 'rotate':
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateAngle = 0;
        break;
      default:
        if (!isIdentity(this.matrix)) {
          this.matrix = createIdentity();
        }
    }
  }
}
