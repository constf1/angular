// tslint:disable: variable-name
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';

import { Autoplay } from 'src/app/common/autoplay';
import { DragListener } from 'src/app/common/drag-listener';
import { append, detach, Linkable } from 'src/app/common/linkable';
import { Point } from 'src/app/common/math2d';

import { SQUARE_SIDE, transform } from '../../squared-paper/squared-paper.component';
import { CWItem, getItemHeight, getItemWidth } from '../crossword-model';

type Cell = Linkable<Cell> & Point & {
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

export type CellState = Point & {
  value: string;
  answer?: string;
  isActive?: boolean;
};

type MouseState = {
  x: number;
  y: number;
  time: number;
  index: number;
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
  private _mouse?: MouseState; // Word on click selection workaround.
  private _dragListener = new DragListener<DragData>();
  private _play = new Autoplay();
  private _items: ReadonlyArray<CWItem>;
  private _selection = -1;
  private _showMistakes = false;
  cols: number;
  rows: number;
  plan: CellMap;
  cells: Cell[];
  tiles: Tile[];
  letters: ReadonlyArray<string>;
  layout: StaticLayout;
  fillPath: string;
  wordPath: string;
  failPath: string;

  @ViewChildren('tiles') tileList: QueryList<ElementRef<HTMLElement>>;

  @Input() set selection(value: number) {
    this._selection = value;
    this._setSelection(value);
  }

  get selection() {
    return this._selection;
  }

  @Input() set showMistakes(value: boolean) {
    if (this._showMistakes === !value) {
      this._showMistakes = value;
      this._setMistakes();
    }
  }

  get showMistakes() {
    return this._showMistakes;
  }

  /* Crossword difficulty: number in the range [0, 1] */
  @Input() difficulty = 0;

  @Input() set items(value: ReadonlyArray<CWItem>) {
    this._items = value;
    this.onNewPuzzle();
  }

  get items() {
    return this._items;
  }

  @Output() selectionChange = new EventEmitter<number>();
  @Output() boardChange = new EventEmitter<CellState[]>();

  get isActive(): boolean {
    return this.cells?.length > 0 && this.cells.findIndex((it) => it.isActive) >= 0;
  }

  constructor(private _renderer: Renderer2) {
    this.items = [];
  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this._dragListener.dragChange.subscribe(event => {
      this._mouse = undefined;
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
    this.cells = [];
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
    for (const key of this.letters) {
      for (const cell of this.plan[key]) {
        this.cells.push(cell);
      }
    }

    this.layout = makeLayout(this.cols, this.rows, this.letters.length);
    this._playIntro();
  }

  onMouseDown(event: MouseEvent, index: number) {
    // console.log('Mousedown:', index);
    if (event.button !== 0) {
      return;
    }
    // event.preventDefault();

    const tile = this.tiles[index];
    if (tile?.isActive) {
      this._dragListener.mouseStart(event, this._renderer, { index });
    }
  }

  onTouchStart(event: TouchEvent) {
    if (event.targetTouches.length > 0) {
      const touch = event.targetTouches[0];
      const index = this.getTileIndex(touch.clientX, touch.clientY);
      if (index >= 0) {
        this._dragListener.touchStart(event, { index });
      }
    }
  }

  onTouchStop(event: TouchEvent) {
    if (this._dragListener.isTouchDragging) {
      this._dragListener.stop(event);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this._dragListener.isTouchDragging) {
      this._dragListener.touchMove(event);
    }
  }

  getTileIndex(clientX: number, clientY: number): number {
    let index = -1;
    if (this.tileList) {
      const tileRefs = this.tileList.toArray();
      for (let i = tileRefs.length; i-- > 0;) {
        if (this.tiles[i].isActive) {
          const rc = tileRefs[i].nativeElement.getBoundingClientRect();
          if (rc.left <= clientX && clientX <= rc.right && rc.top <= clientY && clientY <= rc.bottom) {
            if (index < 0 || this.tiles[index].order < this.tiles[i].order) {
              index = i;
            }
          }
        }
      }
    }
    return index;
  }

  getItemIndex(x: number, y: number) {
    const offset = this._selection < 0 ? 0 : this._selection + 1;
    for (let i = 0; i < this._items.length; i++) {
      const index = (i + offset) % this._items.length;
      const item = this._items[index];
      if (item.vertical) {
        if (x === item.x && y >= item.y && y < item.y + item.letters.length) {
          return index;
        }
      } else {
        if (y === item.y && x >= item.x && x < item.x + item.letters.length) {
          return index;
        }
      }
    }
    return -1;
  }

  onBoardMouse(event: MouseEvent, board: HTMLElement, down: boolean) {
    if (event.button !== 0) {
      return;
    }
    const rc = board.getBoundingClientRect();

    const left = this.layout.baseLeft;
    const top = this.layout.baseTop;
    const x = Math.floor((event.clientX - rc.left) / SQUARE_SIDE) - left;
    const y = Math.floor((event.clientY - rc.top) / SQUARE_SIDE) - top;

    const index = this.getItemIndex(x, y);
    if (index >= 0) {
      if (down) {
        this._mouse = { x, y, index, time: Date.now() };
      } else {
        if (this._mouse) {
          const mouse = this._mouse;
          this._mouse = undefined;

          if (index === mouse.index && x === mouse.x && y === mouse.y && Date.now() - mouse.time < 5000) {
            this.selectionChange.emit(index);
          }
        }
      }
    } else {
      this._mouse = undefined;
    }
  }

  onBoardChange() {
    if (this._showMistakes) {
      this._setMistakes();
    }

    this.boardChange.emit(this.cells.map((c) => ({
      x: c.x,
      y: c.y,
      value: c.value,
      isActive: c.isActive,
      answer: c.next?.value
    })));
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

  isAllPairs() {
    for (const cell of this.cells) {
      if (cell.list?.length !== 2) {
        return false;
      }
    }
    return true;
  }

  getPairedCount() {
    let count = 0;
    for (const cell of this.cells) {
      if (cell.list?.length === 2) {
        count++;
      }
    }
    return count;
  }

  private _playIntro() {
    const tiles = this._makeTiles();
    let count = 0;
    this._play.timeout = 50;
    this._play.play(() => {
      if (count < this.letters.length) {
        const value = this.letters[count];
        this.tiles = this.tiles.concat(tiles.filter((tile) => tile.value === value));
        count++;
        return true;
      } else {
        this._setBase(this.difficulty);
        this._setFillPath();
        this.onBoardChange();
        return false;
      }
    });
  }

  private _makeTiles() {
    const left = this.layout.bankLeft;
    const top = this.layout.bankTop;
    const width = this.layout.bankRight - this.layout.bankLeft;

    const tiles: Tile[] = [];
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

    return tiles;
  }

  private _setBase(difficulty: number) {
    // Activate all the tiles
    for (const tile of this.tiles) {
      tile.isActive = true;
    }
    // Move tiles to the base (except intersections).
    const left = this.layout.baseLeft;
    const top = this.layout.baseTop;

    for (const cell of this.cells) {
      cell.isActive = (Math.random() < difficulty) ||
        ((cell.hasBottom || cell.hasTop) && (cell.hasLeft || cell.hasRight));
      if (!cell.isActive) {
        const tile = this.tiles.find((it) => it.isActive && it.value === cell.value);

        tile.isActive = false;
        tile.x = cell.x + left;
        tile.y = cell.y + top;
        tile.transform = transform(tile.x, tile.y);
        tile.className = 'transition_deal';

        append(cell, tile);
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

  private _setFailPath() {
    this.failPath = '';
    if (this.showMistakes) {
      const { baseLeft, baseTop } = this.layout;
      for (const cell of this.cells) {
        if (cell.isActive && cell.next && cell.next.value !== cell.value) {
          this.failPath += `M${cell.x + baseLeft} ${cell.y + baseTop}h1v1h-1z`;
        }
      }
    }
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
      const x = tile.x + this._dragListener.pageDeltaX / SQUARE_SIDE;
      const y = tile.y + this._dragListener.pageDeltaY / SQUARE_SIDE;
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
      let x = Math.round(tile.x + this._dragListener.pageDeltaX / SQUARE_SIDE);
      x = Math.max(0, Math.min(this.layout.width - 1, x));
      let y = Math.round(tile.y + this._dragListener.pageDeltaY / SQUARE_SIDE);
      y = Math.max(0, Math.min(this.layout.height - 1, y));

      tile.x = x;
      tile.y = y;
      tile.className = 'transition_fast';

      // if (this.tiles.findIndex((it) => !it.isActive && it.x === x && it.y === y) < 0) {
      //   tile.x = x;
      //   tile.y = y;
      //   tile.className = 'transition_fast';
      // } else {
      //   tile.className = 'transition_norm';
      // }
      tile.transform = transform(tile.x, tile.y);

      const left = this.layout.baseLeft;
      const top = this.layout.baseTop;
      const cell = this.cells.find((it) => it.x === x - left && it.y === y - top);
      if (cell) {
        append(cell, tile);
      } else {
        detach(tile);
      }
      // if (this.isAllPairs()) {
      //   console.log('Done!');
      // }
      // console.log('Pairs:', this.getPairedCount());

      this.onBoardChange();
    }
  }

  private _setSelection(value: number) {
    const item = this._items[value];
    if (item) {
      const left = this.layout.baseLeft;
      const top = this.layout.baseTop;
      if (item.vertical) {
        const x = left + item.x;
        const y = top + item.y;
        this.wordPath = `M${x} ${y}h1v${item.letters.length}h-1z`;
      } else {
        const x = left + item.x;
        const y = top + item.y + 1;
        this.wordPath = `M${x} ${y}v-1h${item.letters.length}v1z`;
      }
    } else {
      this.wordPath = '';
    }
  }

  private _setMistakes() {
    if (this._showMistakes) {
      const { baseLeft, baseTop, bankLeft, bankTop, bankRight } = this.layout;
      const bankWidth = bankRight - bankLeft;

      for (const cell of this.cells) {
        if (cell.isActive && cell.next?.value === cell.value) {
          const tile = cell.next as Tile;
          cell.isActive = tile.isActive = false;
          tile.x = cell.x + baseLeft;
          tile.y = cell.y + baseTop;
          tile.transform = transform(tile.x, tile.y);
          tile.className = 'transition_deal';

          // Move any extra tiles to the bank.
          while (cell.list?.length > 2) {
            const extra = cell.list.tail as Tile;
            detach(extra);

            const i = this.letters.findIndex((it) => it === extra.value);
            extra.x = bankLeft + i % bankWidth;
            extra.y = bankTop + Math.floor(i / bankWidth);
            extra.transform = transform(extra.x, extra.y);
            extra.className = 'transition_norm';
          }
        }
      }
    }
    this._setFailPath();
  }
}
