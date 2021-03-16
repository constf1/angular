// tslint:disable: variable-name
import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { Autoplay } from 'src/app/common/autoplay';
import { DragListener } from 'src/app/common/drag-listener';
import { Point } from 'src/app/common/math2d';

import { SQUARE_SIDE, transform } from '../../squared-paper/squared-paper.component';
import { CWItem, getItemHeight, getItemWidth } from '../crossword-model';

type Cell = Point & {
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

type DragData = {
  index: number;
};

function joinLines(a: string[], b: string[]): string[] | undefined {
  return a[a.length - 1] === b[0] ? a.concat(b.slice(1))
    : b[b.length - 1] === a[0] ? b.concat(a.slice(1))
      : undefined;
}

function mergeLines(lines: string[][]) {
  for (let i = lines.length; i-- > 1;) {
    const a = lines[i];
    for (let j = i; j-- > 0;) {
      const b = lines[j];
      const c = joinLines(a, b);
      if (c) {
        lines[j] = c;
        lines.splice(i, 1);
        // Restart merging:
        i = lines.length;
        break;
      }
    }
  }
}

@Component({
  selector: 'app-crossword-board',
  templateUrl: './crossword-board.component.html',
  styleUrls: ['./crossword-board.component.scss']
})
export class CrosswordBoardComponent implements OnInit, OnDestroy {
  private _dragListener = new DragListener<DragData>();
  private _play = new Autoplay();
  private _items: ReadonlyArray<CWItem>;
  cols: number;
  rows: number;
  plan: CellMap;
  letters: ReadonlyArray<string>;
  layout: StaticLayout;
  tiles: Tile[];
  fillPath: string;

  @Input() set items(value: ReadonlyArray<CWItem>) {
    this._items = value;
    this.onNewPuzzle();
  }

  get items() {
    return this._items;
  }

  constructor(private _renderer: Renderer2) {
    this.items = [];
  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this._dragListener.dragChange.subscribe(event => {
      switch (event) {
        case 'DragStart':
          this._onDragStart();
          break;
        case 'DragMove':
          this._onDragMove();
          break;
        case 'DragStop':
          this._onDragStop();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this._play.stop();
  }

  onNewPuzzle() {
    this.cols = 0;
    this.rows = 0;
    this.plan = {};
    this.tiles = [];
    this.fillPath = '';

    for (const item of this._items) {
      this.cols = Math.max(this.cols, item.x + getItemWidth(item));
      this.rows = Math.max(this.rows, item.y + getItemHeight(item));

      for (let i = item.letters.length; i-- > 0;) {
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

    this._play.timeout = 50;
    this._play.play(
      () => {
        this._makeTiles();
        this._play.timeout = 1000;
        this._play.play(() => {
          this._setBase();
          this._setFillPath();
        });
      }
    );
  }

  onMouseDown(event: MouseEvent, index: number) {
    // console.log('Mousedown:', index);
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();

    const tile = this.tiles[index];
    if (tile?.isActive) {
      this._dragListener.mouseStart(event, this._renderer, { index });
    }
  }

  moveTileToFront(index: number) {
    const front = this.tiles[index];
    if (front) {
      for (const tile of this.tiles) {
        if (tile.order > front.order) {
          tile.order--;
        }
      }
    }
    front.order = this.tiles.length;
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

  private _setFillPath() {
    const lines = this._getLines();
    mergeLines(lines);

    const pad = this.layout.pad;
    const left = this.layout.baseLeft - pad;
    const top = this.layout.baseTop - pad;
    const width = this.layout.baseRight + pad - left;
    const height = this.layout.baseBottom + pad - top;

    let path = `M${left} ${top}v${height}h${width}v${-height}z`;
    for (const shape of lines) {
      path += 'M' + shape.join(' ') + (shape[0] === shape[shape.length - 1] ? 'z' : ' ');
    }
    this.fillPath = path;
  }

  private _getLines() {
    const left = this.layout.baseLeft;
    const top = this.layout.baseTop;

    const buf = [] as string[][];
    for (const key of this.letters) {
      for (const cell of this.plan[key]) {
        const x = cell.x + left;
        const y = cell.y + top;

        if (!cell.hasTop) {
          buf.push([`${x},${y}`, `${x + 1},${y}`]);
        }
        if (!cell.hasRight) {
          buf.push([`${x + 1},${y}`, `${x + 1},${y + 1}`]);
        }
        if (!cell.hasBottom) {
          buf.push([`${x + 1},${y + 1}`, `${x},${y + 1}`]);
        }
        if (!cell.hasLeft) {
          buf.push([`${x},${y + 1}`, `${x},${y}`]);
        }
      }
    }
    return buf;
  }

  private _onDragStart() {
    const data = this._dragListener.data;
    this.moveTileToFront(data.index);
    const tile = this.tiles[data.index];
    if (tile) {
      tile.className = 'transition_grab';
    }
  }

  private _onDragMove() {
    const data = this._dragListener.data;
    const tile = this.tiles[data.index];
    if (tile) {
      const x = tile.x + this._dragListener.deltaX / SQUARE_SIDE;
      const y = tile.y + this._dragListener.deltaY / SQUARE_SIDE;
      tile.transform = transform(
        Math.max(0, Math.min(this.layout.width - 1, x)),
        Math.max(0, Math.min(this.layout.height - 1, y)));
      tile.className = 'transition_drag';
    }
  }

  private _onDragStop() {
    const data = this._dragListener.data;
    const tile = this.tiles[data.index];
    if (tile) {
      const x = Math.round(tile.x + this._dragListener.deltaX / SQUARE_SIDE);
      const y = Math.round(tile.y + this._dragListener.deltaY / SQUARE_SIDE);

      tile.x = Math.max(0, Math.min(this.layout.width - 1, x));
      tile.y = Math.max(0, Math.min(this.layout.height - 1, y));
      tile.transform = transform(tile.x, tile.y);

      tile.className = 'transition_fast';
    }
  }
}
