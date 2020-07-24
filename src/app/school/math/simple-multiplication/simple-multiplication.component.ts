import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EMPTY_PATH, transform } from '../../squared-paper/squared-paper.component';

// margin
const DX = 2;
const DY = 2;

function translate(x: number, y: number) {
  return transform(x + DX, y + DY);
}

function toTerm(value: number | string): number {
  const n = +value;
  return isNaN(n) ? 0 : n;
}


@Component({
  selector: 'app-simple-multiplication',
  templateUrl: './simple-multiplication.component.html',
  styleUrls: ['./simple-multiplication.component.scss']
})
export class SimpleMultiplicationComponent implements OnInit, OnChanges {
  @Input() multiplier = 0;
  @Input() multiplicand = 0;
  @Input() hiddenTerm = -1; // multiplier, multiplicand, product

  multiplierPath: string;
  multiplierText: string;
  multiplierTransform: string;

  multiplicandPath: string;
  multiplicandText: string;
  multiplicandTransform: string;

  productPath: string;
  productText: string;
  productTransform: string;

  colNum = 2 * DX;
  rowNum = 2 * DY;
  animationName = '';

  constructor() {
    this.clear();
  }

  setAnimation(name: string) {
    if (name) {
      if (name === this.animationName) {
        this.animationName = name + ' simple-multiplication-animation-restart';
      } else {
        this.animationName = name;
      }
    } else {
      this.animationName = '';
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clear();

    const h = toTerm(this.multiplier);
    const v = toTerm(this.multiplicand);
    const s = h * v;

    if (s > 0) {
      this.productPath = `M0 0h${h}v${v}h${-h}z`;
      this.productText = (this.hiddenTerm === 2 ? '?' : '' + s);
      this.productTransform = translate(h / 2, v / 2);

      this.multiplierPath = `M0 ${v}a.5 .5 0 0 0 .5 .5h${h / 2 - 1}a.5 .5 0 0 1 .5 .5a.5 .5 0 0 1 .5 -.5h${h / 2 - 1}a.5 .5 0 0 0 .5 -.5`;
      this.multiplierText = (this.hiddenTerm === 0 ? '?' : '' + h);
      this.multiplierTransform = translate(h / 2, v + 1.5);

      this.multiplicandPath = `M${h} 0a.5 .5 0 0 1 .5 .5v${v / 2 - 1}a.5 .5 0 0 0 .5 .5a.5 .5 0 0 0 -.5 .5v${v / 2 - 1}a.5 .5 0 0 1 -.5 .5`;
      this.multiplicandText = (this.hiddenTerm === 1 ? '?' : '' + v);
      this.multiplicandTransform = translate(h + 1.5, v / 2);

      this.colNum += (h + 1);
      this.rowNum += (v + 1);
    }
  }

  clear() {
    this.multiplierPath = this.multiplicandPath = this.productPath = EMPTY_PATH;

    this.multiplierText = this.multiplierTransform =
    this.multiplicandText = this.multiplicandTransform =
    this.productText = this.productTransform = undefined;

    this.colNum = 2 * DX;
    this.rowNum = 2 * DY;
  }

}
