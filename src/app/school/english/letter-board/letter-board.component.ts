/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const DX = 1;
const DY = 1;
// const EMPTY_PATH = 'M0 0z';

export interface Segment {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface Selection {
  segment?: Segment;
  path?: string;
}

// function isInOrder(a: number, b: number, c: number): boolean {
//   return (a >= b && b >= c) || (a <= b && b <= c);
// }

// function isPoint(s: Readonly<Segment>): boolean {
//   return s.x1 === s.x2 && s.y1 === s.y2;
// }

function isLine(s: Readonly<Segment>, x: number, y: number): boolean {
  return ((x - s.x1) * (s.y2 - s.y1) === (y - s.y1) * (s.x2 - s.x1));
}

// function isIntersecting(s: Readonly<Segment>, x: number, y: number): boolean {
//   return isLine(s, x, y) && isInOrder(s.x1, x, s.x2) && isInOrder(s.y1, y, s.y2);
// }

function select(x: number, y: number, s?: Segment): Segment {
  if (s) {
    if (isLine(s, x, y)) {
      const { x1, x2, y1, y2 } = s;
      // Vertical line
      if (x === x1 && x1 === x2) {
        if (y < y1) {
          return { x1, x2, y1: y, y2 };
        } else {
          return { x1, x2, y1, y2: y };
        }
      }
      // Horizontal line
      if (y === y1 && y1 === y2) {
        if (x < x1) {
          return { y1, y2, x1: x, x2 };
        } else {
          return { y1, y2, x1, x2: x };
        }
      }
      // Diagonal line
      if (Math.abs(x - x1) === Math.abs(y - y1)) {
        if (x < x1) {
          return { x1: x, x2, y1: y, y2 };
        } else {
          return { x1, x2: x, y1, y2: y };
        }
      }
    }
  }
  return { x1: x, y1: y, x2: x, y2: y };
}

function segmentToPath(s: Readonly<Segment>): string {
  const { x1, y1, x2, y2 } = s;
  const dx = x2 - x1;
  const dy = y2 - y1;

  let x0 = 0;
  let y0 = 0;
  let d = '';

  if (dx > 0) {
    if (dy === 0) {
      x0 = x1 + 0.5 + 0.354;
      y0 = y1 + 0.146;
      d = 'a.2 .2 0 0 0 .3 0a.5 .5 0 0 1 .7 0'.repeat(dx - 1)
        + 'a.2 .2 0 0 0 .3 0a.5 .5 0 1 1 0 .7'
        + 'a.2 .2 0 0 0-.3 0a.5 .5 0 0 1-.7 0'.repeat(dx - 1)
        + 'a.2 .2 0 0 0-.3 0a.5 .5 0 1 1 0-.7';
    } else if (dx === dy) {
      x0 = x1 + 1;
      y0 = y1 + 0.5;
      d = 'a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5'.repeat(dx - 1)
        + 'a.5 .5 0 0 0 .5 .5a.5 .5 0 1 1-.5 .5'
        + 'a.5 .5 0 0 0-.5-.5a.5 .5 0 0 1-.5-.5'.repeat(dx - 1)
        + 'a.5 .5 0 0 0-.5-.5a.5 .5 0 1 1 .5-.5';
    } else if (dx === -dy) {
      x0 = x1 + 0.5;
      y0 = y1;
      d = 'a.5 .5 0 0 0 .5-.5a.5 .5 0 0 1 .5-.5'.repeat(dx - 1)
        + 'a.5 .5 0 0 0 .5-.5a.5 .5 0 1 1 .5 .5'
        + 'a.5 .5 0 0 0-.5 .5a.5 .5 0 0 1-.5 .5'.repeat(dx - 1)
        + 'a.5 .5 0 0 0-.5 .5a.5 .5 0 1 1-.5-.5';
    }
  } else if (dx === 0) {
    if (dy > 0) {
      x0 = x1 + 1 - 0.146;
      y0 = y1 + 0.5 + 0.354;
      d = 'a.2 .2 0 0 0 0 .3a.5 .5 0 0 1 0 .7'.repeat(dy - 1)
        + 'a.2 .2 0 0 0 0 .3a.5 .5 0 1 1-.7 0'
        + 'a.2 .2 0 0 0 0-.3a.5 .5 0 0 1 0-.7'.repeat(dy - 1)
        + 'a.2 .2 0 0 0 0-.3a.5 .5 0 1 1 .7 0';
    } else if (dy === 0) {
      x0 = x1 + 0.5;
      y0 = y1;
      d = 'a.5 .5 0 0 1 0 1a.5 .5 0 0 1 0 -1';
    }
  }

  return `M${x0} ${y0}${d}z`;
}

function frameToPath(cx: number, cy: number): string {
  const h1 = cx > 2 ? 'q.5 -1 1 0'.repeat(cx - 2) : 'h-2';
  const h2 = cx > 2 ? 'q-.5 1-1 0'.repeat(cx - 2) : 'h 2';

  const v1 = cy > 2 ? 'q 1 .5 0 1'.repeat(cy - 2) : 'v-2';
  const v2 = cy > 2 ? 'q-1-.5 0-1'.repeat(cy - 2) : 'v 2';

  return `M0 1q-2-3 1-1${h1}q 3-2 1 1${v1}q 2 3-1 1${h2}q-3 2-1-1${v2}z`;
}


@Component({
  selector: 'app-letter-board',
  templateUrl: './letter-board.component.html',
  styleUrls: ['./letter-board.component.scss']
})
export class LetterBoardComponent implements OnInit {
  @Input() set letters(value: string[][]) {
    this._letters = value;
    const cy = value.length;
    const cx = cy > 0 ? value[0].length : 0;

    this.colNum = 2 * DX + cx;
    this.rowNum = 2 * DY + cy;
    this.pathFrame = frameToPath(cx, cy);
  }

  get letters() {
    return this._letters;
  }

  @Input() showFrame = true;
  @Input() activeSelection = -1;
  @Input() selectionList: Selection[] = [];

  @Output() selectionChange = new EventEmitter<Selection>();

  colNum: number;
  rowNum: number;
  pathFrame: string;

  private _letters: string[][];

  constructor() {
    this.letters = [];
  }

  ngOnInit(): void {
  }

  onSelect(x: number, y: number) {
    const item = this.selectionList[this.activeSelection];
    if (item) {
      if (item.segment &&
        item.segment.x1 === x && item.segment.x2 === x &&
        item.segment.y1 === y && item.segment.y2 === y) {
        // Clear selection
        item.segment = undefined;
        item.path = undefined;
      } else {
        item.segment = select(x, y, item.segment);
        item.path = segmentToPath(item.segment);
      }
      this.selectionChange.emit(item);
    }
  }
}
