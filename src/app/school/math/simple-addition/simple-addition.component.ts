import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SQUARE_SIDE } from '../../squared-paper/squared-paper.component';

const EMPTY_PATH = 'M0 0z';
// margin
const DX = 2;
const DY = 2;

function translate(x: number, y: number) {
  return `translate(${(DX + x) * SQUARE_SIDE}px, ${(DY + y) * SQUARE_SIDE}px)`;
}

function toTerm(value: number | string): number {
  const n = +value;
  return isNaN(n) ? 0 : n;
}

@Component({
  selector: 'app-simple-addition',
  templateUrl: './simple-addition.component.html',
  styleUrls: ['./simple-addition.component.scss']
})
export class SimpleAdditionComponent implements OnInit, OnChanges {
  @Input() augend = 0;
  @Input() addend = 0;
  @Input() hiddenTerm = -1; // augend, addend, sum

  // SVG paths:
  augendPath: string;
  addendPath: string;
  sumPath: string;
  sumOnesPath: string;
  sumTensPath: string;

  // DIV texts:
  augendText: string;
  addendText: string;
  sumText: string;

  // DIV transforms:
  augendTransform: string;
  addendTransform: string;
  sumOnesTransform: string;
  sumTensTransform: string;
  sumTransform: string;

  rowNum = 2 * DY;

  animationName = '';

  constructor() {
    this.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  ngOnInit(): void {
  }

  setAnimation(name: string) {
    if (name) {
      if (name === this.animationName) {
        this.animationName = name + ' simple-addition-animation-restart';
      } else {
        this.animationName = name;
      }
    } else {
      this.animationName = '';
    }
  }

  reset() {
    this.augendPath = this.addendPath = this.sumPath =
    this.sumTensPath = this.sumOnesPath = EMPTY_PATH;

    this.rowNum = 2 * DY;

    this.augendTransform = this.addendTransform = this.sumTransform =
    this.sumOnesTransform = this.sumTensTransform = '';
  }

  update() {
    this.reset();

    const augend = toTerm(this.augend);
    const addend = toTerm(this.addend);
    const sum = augend + addend;

    const augendOnes = augend % 10;
    const addendOnes = addend % 10;
    const sumOnes = sum % 10;

    const augendTens = Math.floor(augend / 10);
    const addendTens = Math.floor(addend / 10);
    const sumTens = Math.floor(sum / 10);

    if (augend > 0) {
      const ones = augendOnes;
      const tens = augendTens;

      if (tens > 0) {
        if (ones > 0) {
          this.augendPath = `M0 0h10v${tens}h${ones - 10}v1h${-ones}z`;
        } else {
          this.augendPath = `M0 0h10v${tens}h-10z`;
        }
        const dy = ones > 5 ? 0 : -0.5;
        this.augendTransform = translate(5, dy + tens / 2);
      } else {
        this.augendPath = `M0 0h${ones}v1h${-ones}v-1z`;
        this.augendTransform = translate(ones / 2, 0);
      }
    }

    if (addend > 0) {
      const pref = Math.min(addend, 10 - augendOnes);
      const ones = (addend - pref) % 10;
      const tens = Math.floor((addend - pref) / 10);
      this.addendPath = `M${augendOnes} ${augendTens}h${pref}v${tens + 1}`;

      if (tens > 0) {
        const yo = ones > 5 ? 1 : 0;
        const yp = pref > 5 ? 0 : 1;
        this.addendTransform = translate(5, augendTens + (tens + yp + yo) / 2);
      } else {
        const x = pref + ones - 10;
        if (x >= 2) {
          this.addendTransform = translate(ones - x / 2, augendTens + 0.5);
        } else if (pref > ones) {
          this.addendTransform = translate(augendOnes + pref / 2, augendTens);
        } else {
          // shift right as much as possible
          const xo = Math.max(ones / 2, ones - 1);
          this.addendTransform = translate(xo, augendTens + 1);
        }
      }

      if (ones > 0) {
        this.addendPath += `h${ones - 10}v1h${-ones}v${-tens - 1}h${10 - pref}z`;
      } else {
        if (tens > 0) {
          this.addendPath += `h-10v${-tens}h${10 - pref}z`;
        } else {
          this.addendPath += `h${-pref}z`;
        }
      }
    }

    if (sum > 0) {
      const tens = sumTens;
      const x = tens < 10 ? 11 : 10;
      this.sumTransform = translate(x, tens + 1);
      if (tens > 0) {
        this.rowNum += tens;
        const v = (tens - 2) / 2;
        this.sumTensPath = `M10 0a.5 .5 0 0 1 .5 .5v${v}a.5 .5 0 0 0 .5 .5a.5 .5 0 0 0 -.5 .5v${v}a.5 .5 0 0 1 -.5 .5`
          + `m1 ${-1 - v}h.5v${v + 2}`
          + 'm-.1 -.4l.1 .4 .1 -.4'; // arrow down
        this.sumTensTransform = translate(11.5, Math.floor(v));
      }
      const ones = sumOnes;
      if (ones > 0) {
        this.rowNum += 3;
        const h = (ones - 2) / 2;
        this.sumOnesPath = `M0 ${tens + 1}a.5 .5 0 0 0 .5 .5h${h}a.5 .5 0 0 1 .5 .5a.5 .5 0 0 1 .5 -.5h${h}a.5 .5 0 0 0 .5 -.5`
          + `m${-1 - h} 1v.5h${13.5 + h - ones}v-.5`
          + 'm-.1 .4l.1 -.4 .1 .4'; // arrow up
        this.sumOnesTransform = translate(h, tens + 3);
      }

      if (tens > 0) {
        if (ones > 0) {
          this.sumPath = `M0 0h10v${tens}h${ones - 10}v1h${-ones}z`;
        } else {
          this.sumPath = `M0 0h10v${tens}h-10z`;
        }
      } else {
        this.sumPath = `M0 0h${ones}v1h${-ones}v-1z`;
      }
    }

    // Update texts:
    this.augendText = this.hiddenTerm === 0 ? '?' : (augendTens * 10 + augendOnes).toString();
    this.addendText = this.hiddenTerm === 1 ? '?' : (addendTens * 10 + addendOnes).toString();
    this.sumText = this.hiddenTerm === 2 ? '?' : (sumTens * 10 + sumOnes).toString();
  }

}
