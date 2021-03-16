// tslint:disable: variable-name
import { Component, Input, OnInit } from '@angular/core';
import { Point } from 'src/app/common/math2d';
import { CWItem, getItemHeight, getItemWidth } from '../crossword-model';

type Cell =  Point & {
  value: string;
  // neighbours, if any
  hasLeft?: boolean;
  hasRight?: boolean;
  hasTop?: boolean;
  hasBottom?: boolean;
};

type CellMap = {
  [key: string]: Cell[];
};

function makeLayout(cols: number, rows: number, charCount = 26) {
  const pad = 1; // 1 square padding
  const margin = 4; // 4 squares margin
  const bankHeight = Math.ceil(charCount / (margin - pad - pad)); // 26 latin letters in 2 columns

  const width = pad + cols + pad + margin;
  const height = pad + Math.max(rows, bankHeight) + pad;

  const marginLeft = width - margin;
  const marginRight = width - margin;
  const marginTop = 0;
  const marginBottom = height;

  const baseLeft = pad;
  const baseRight = baseLeft + cols;
  const baseTop = pad;
  const baseBottom = baseTop + rows;

  const bankLeft = marginLeft + pad;
  const bankRight = width - pad;
  const bankTop = pad;
  const bankBottom = bankTop + bankHeight;

  return {
    pad,
    margin,
    width,
    height,

    bankLeft,
    bankRight,
    bankTop,
    bankBottom,

    baseLeft,
    baseRight,
    baseTop,
    baseBottom,

    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  };
}

type StaticLayout = Readonly<ReturnType<typeof makeLayout>>;

@Component({
  selector: 'app-crossword-board',
  templateUrl: './crossword-board.component.html',
  styleUrls: ['./crossword-board.component.scss']
})
export class CrosswordBoardComponent implements OnInit {
  private _items: ReadonlyArray<CWItem>;
  cols: number;
  rows: number;
  plan: CellMap;
  letters: ReadonlyArray<string>;
  layout: StaticLayout;

  @Input() set items(value: ReadonlyArray<CWItem>) {
    this._items = value;
    this.onNewPuzzle();
  }

  get items() {
    return this._items;
  }

  constructor() {
    this.items = [];
  }

  ngOnInit(): void {
  }

  onNewPuzzle() {
    this.cols = 0;
    this.rows = 0;
    this.plan = {};

    for (const item of this._items) {
      this.cols = Math.max(this.cols, item.x + getItemWidth(item));
      this.rows = Math.max(this.rows, item.y + getItemHeight(item));

      for (let i = item.letters.length; i-- > 0; ) {
        const value = item.letters[i];
        const row = this.plan[value] || (this.plan[value] = []);
        let x: number;
        let y: number;
        if (item.vertical) {
          x = item.x;
          y = item.y + i;
        } else {
          x = item.x + i;
          y = item.y;
        }
        let index = row.findIndex((c) => c.x === x && c.y === y);
        if (index < 0) {
          index = row.length;
          row.push({ x, y, value });
        }
        if (item.vertical) {
          row[index].hasTop = i > 0;
          row[index].hasBottom = i < item.letters.length - 1;
        } else {
          row[index].hasLeft = i > 0;
          row[index].hasRight = i < item.letters.length - 1;
        }
      }
    }

    this.letters = Object.keys(this.plan).sort();
    this.layout = makeLayout(this.cols, this.rows, this.letters.length);
  }
}
