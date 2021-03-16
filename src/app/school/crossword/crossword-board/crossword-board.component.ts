// tslint:disable: variable-name
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Autoplay } from 'src/app/common/autoplay';
import { Point } from 'src/app/common/math2d';
import { transform } from '../../squared-paper/squared-paper.component';
import { CWItem, getItemHeight, getItemWidth } from '../crossword-model';

type Cell =  Point & {
  value: string;
  isActive?: boolean;
  // neighbours, if any
  hasLeft?: boolean;
  hasRight?: boolean;
  hasTop?: boolean;
  hasBottom?: boolean;
};

type CellMap = {
  [key: string]: Cell[];
};

type Tile = Cell & {
  order: number;
  transform: string;
  className: string;
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
export class CrosswordBoardComponent implements OnInit, OnDestroy {
  private _play = new Autoplay();
  private _items: ReadonlyArray<CWItem>;
  cols: number;
  rows: number;
  plan: CellMap;
  letters: ReadonlyArray<string>;
  layout: StaticLayout;
  tiles: Tile[];

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

  ngOnDestroy(): void {
    this._play.stop();
  }

  onNewPuzzle() {
    this.cols = 0;
    this.rows = 0;
    this.plan = {};
    this.tiles = [];

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

    this._play.timeout = 2500;
    this._play.play(
      () => {
        this._makeTiles();
        this._play.timeout = 2000;
        this._play.play(() => this._setBase());
      }
    );
  }

  private _makeTiles() {
    const left = this.layout.bankLeft;
    const top = this.layout.bankTop;
    const width = this.layout.bankRight - this.layout.bankLeft;

    const tiles = [];
    for (let i = 0; i < this.letters.length; i++) {
      for (const cell of this.plan[this.letters[i]]) {
        const x = left + i % width;
        const y = top + Math.floor(i / width);
        tiles.push({
          ...cell, x, y,
          order: tiles.length + 1,
          className: '',
          transform: transform(x, y)
        });
      }
    }

    this.tiles = tiles;
  }

  private _setBase() {
    // Activate all the tiles
    for (const tile of this.tiles) {
      tile.isActive = true;
    }
    // Move tiles to the base (except intersections).
    const left = this.layout.baseLeft;
    const top = this.layout.baseTop;
    for (const key of this.letters) {
      for (const cell of this.plan[key]) {
        cell.isActive = (cell.hasBottom || cell.hasTop) && (cell.hasLeft || cell.hasRight);
        if (!cell.isActive) {
          const tile = this.tiles.find((it) => it.isActive && it.value === key);

          tile.isActive = false;
          tile.x = cell.x + left;
          tile.y = cell.y + top;
          tile.transform = transform(tile.x, tile.y);
          tile.className = 'transition_deal';
        }
      }
    }
  }
}
