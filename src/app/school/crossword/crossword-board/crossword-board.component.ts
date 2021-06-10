// tslint:disable: variable-name
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';

import { Autoplay } from 'src/app/common/autoplay';
import { DragListener } from 'src/app/common/drag-listener';
import { append, detach, Linkable } from 'src/app/common/linkable';
import { Point } from 'src/app/common/math2d';
import { TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';

import { SQUARE_SIDE, transform } from '../../squared-paper/squared-paper.component';
import { Grid } from '../crossword-model';

enum Axis { x = 0, y = 1 }

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

type MouseState = TabListSelection & {
  x: number;
  y: number;
  time: number;
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

const DRAG_THRESHOLD = 4;

type DragData = {
  index: number;
  dragged?: boolean;
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
  private _grid: Readonly<Grid>;
  private _selection: TabListSelection;
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

  @Input() set selection(value: TabListSelection) {
    this._selection = value;
    this.wordPath = this._getSelectionPath();
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

  @Input() set grid(value: Readonly<Grid>) {
    this._grid = value;
    this.onNewPuzzle();
  }

  get grid() {
    return this._grid;
  }

  @Output() selectionChange = new EventEmitter<TabListSelection>();
  @Output() boardChange = new EventEmitter<CellState[]>();

  get isActive(): boolean {
    return this.cells?.length > 0 && this.cells.findIndex((it) => it.isActive) >= 0;
  }

  constructor(private _renderer: Renderer2) {
    this.grid = { xWords: [], yWords: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
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
    this.cols = this._grid.xMax - this._grid.xMin;
    this.rows = this._grid.yMax - this._grid.yMin;
    this.plan = {};
    this.cells = [];
    this.tiles = [];
    this.fillPath = '';

    for (const item of this._grid.xWords) {
      const y = this._grid.yMin + item.y;
      for (let i = item.letters.length; i-- > 0;) {
        const x = this._grid.xMin + item.x + i;
        const value = item.letters[i];
        const row = this.plan[value] || (this.plan[value] = []);
        let index = row.findIndex((c) => c.x === x && c.y === y);
        if (index < 0) {
          index = row.length;
          row.push({ x, y, value });
        }
        row[index].hasLeft = i > 0;
        row[index].hasRight = i < item.letters.length - 1;
      }
    }

    for (const item of this._grid.yWords) {
      const x = this._grid.xMin + item.x;
      for (let i = item.letters.length; i-- > 0;) {
        const y = this._grid.yMin + item.y + i;
        const value = item.letters[i];
        const row = this.plan[value] || (this.plan[value] = []);
        let index = row.findIndex((c) => c.x === x && c.y === y);
        if (index < 0) {
          index = row.length;
          row.push({ x, y, value });
        }
        row[index].hasTop = i > 0;
        row[index].hasBottom = i < item.letters.length - 1;
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

  getXItemIndex(x: number, y: number): TabListSelection | null {
    const grid = this._grid;
    if (grid) {
      for (let index = grid.xWords.length; index-- > 0;) {
        const wx = grid.xWords[index];
        if (y === wx.y && x >= wx.x && x < wx.x + wx.letters.length) {
          return { groupIndex: Axis.x, itemIndex: index };
        }
      }
    }
    return null;
  }

  getYItemIndex(x: number, y: number): TabListSelection | null {
    const grid = this._grid;
    if (grid) {
      for (let index = grid.yWords.length; index-- > 0;) {
        const wy = grid.yWords[index];
        if (x === wy.x && y >= wy.y && y < wy.y + wy.letters.length) {
          return { groupIndex: Axis.y, itemIndex: index };
        }
      }
    }
    return null;
  }

  getItemIndex(x: number, y: number): TabListSelection | null {
    // Toggle axis priority.
    if (this._selection?.groupIndex === Axis.x) {
      return this.getYItemIndex(x, y) || this.getXItemIndex(x, y);
    }
    return this.getXItemIndex(x, y) || this.getYItemIndex(x, y);
  }

  onBoardMouse(event: MouseEvent, board: HTMLElement, down: boolean) {
    if (event.button !== 0) {
      return;
    }
    const rc = board.getBoundingClientRect();

    const x = Math.floor((event.clientX - rc.left) / SQUARE_SIDE) - this.layout.baseLeft - this._grid.xMin;
    const y = Math.floor((event.clientY - rc.top) / SQUARE_SIDE) - this.layout.baseTop - this._grid.yMin;

    const sel = this.getItemIndex(x, y);
    if (sel) {
      if (down) {
        this._mouse = { ...sel, x, y, time: Date.now() };
      } else {
        if (this._mouse) {
          const mouse = this._mouse;
          this._mouse = undefined;

          if (sel.groupIndex === mouse.groupIndex && sel.itemIndex === mouse.itemIndex
            && x === mouse.x && y === mouse.y && Date.now() - mouse.time < 5000) {
            this.selectionChange.emit(sel);
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
        this._setFailPath();
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

    const pad = this.layout.pad;
    const left = this.layout.baseLeft - pad;
    const right = this.layout.baseRight + pad;
    const top = this.layout.baseTop - pad;
    const bottom = this.layout.baseBottom + pad;

    const fails: {[key: string]: boolean} = {};

    // skip dragged tile, if any
    const skip = (this._dragListener.isDragging && this._dragListener.data) ?
      this.tiles[this._dragListener.data.index] : undefined;

    for (const tile of this.tiles) {
      if (tile === skip) {
        continue;
      }

      // restrict the area
      if (tile.x >= left && tile.x < right && tile.y >= top && tile.y < bottom) {
        if (
          // the tile is not on a cell
          !tile.list
          // a pile of tiles
          || tile.list.length > 3
          // a pile of two or more tiles and no tile is draggged away
          || (tile.list !== skip?.list && tile.list.length > 2)
          // a mistake
          || (this.showMistakes && tile.value !== tile.list.head.value)) {
          const path = `M${tile.x} ${tile.y}h1v1h-1z`;
          if (!fails[path]) {
            fails[path] = true;
            this.failPath += path;
          }
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
      this._setFailPath();
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

      if (Math.abs(this._dragListener.pageDeltaX) > DRAG_THRESHOLD || Math.abs(this._dragListener.pageDeltaY) > DRAG_THRESHOLD) {
        data.dragged = true;
      }
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

      const x0 = x - this.layout.baseLeft;
      const y0 = y - this.layout.baseTop;
      const cell = this.cells.find((it) => it.x === x0 && it.y === y0);
      if (cell) {
        append(cell, tile);
      } else {
        detach(tile);

        // Auto move the tile into selected word.
        if (!data.dragged && this._selection) {
          this._moveAuto(tile);
        }
      }
      // if (this.isAllPairs()) {
      //   console.log('Done!');
      // }
      // console.log('Pairs:', this.getPairedCount());

      this._setFailPath();
      this.onBoardChange();
    }
  }

  private _moveAuto(tile: Tile): void {
    const cell = this._getNextCell();
    if (cell) {
      tile.x = cell.x + this.layout.baseLeft;
      tile.y = cell.y + this.layout.baseTop;
      tile.transform = transform(tile.x, tile.y);
      tile.className = 'transition_auto';

      append(cell, tile);
    }
  }

  private _getNextCell(): Cell | undefined {
    if (this._selection) {
      const { groupIndex, itemIndex } = this._selection;
      if (groupIndex === Axis.x) {
        const wx = this._grid.xWords[itemIndex];
        if (wx) {
          for (let dx = 0; dx < wx.letters.length; dx++) {
            const cell = this.cells.find((it) => it.x === wx.x + dx && it.y === wx.y);
            if (cell && !cell.list || cell.list.length <= 1) {
              return cell;
            }
          }
        }
      } else if (groupIndex === Axis.y) {
        const wy = this._grid.yWords[itemIndex];
        if (wy) {
          for (let dy = 0; dy < wy.letters.length; dy++) {
            const cell = this.cells.find((it) => it.x === wy.x && it.y === wy.y + dy);
            if (cell && !cell.list || cell.list.length <= 1) {
              return cell;
            }
          }
        }
      }
    }
    return undefined;
  }

  private _getSelectionPath() {
    if (this._selection && this._grid) {
      const { groupIndex, itemIndex } = this._selection;
      if (groupIndex === Axis.x) {
        const wx = this._grid.xWords[itemIndex];
        if (wx) {
          const x = this.layout.baseLeft + this._grid.xMin + wx.x;
          const y = this.layout.baseTop + this._grid.yMin + wx.y + 1;
          return `M${x} ${y}v-1h${wx.letters.length}v1z`;
        }
      } else if (groupIndex === Axis.y) {
        const wy = this._grid.yWords[itemIndex];
        if (wy) {
          const x = this.layout.baseLeft + this._grid.xMin + wy.x;
          const y = this.layout.baseTop + this._grid.yMin + wy.y;
          return `M${x} ${y}h1v${wy.letters.length}h-1z`;
        }
      }
    }
    return '';
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
