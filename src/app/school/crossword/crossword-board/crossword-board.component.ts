// tslint:disable: variable-name
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

import { Autoplay } from 'src/app/common/autoplay';
import { DragListener } from 'src/app/common/drag-listener';
import { append, detach } from 'src/app/common/linkable';
import { TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';

import { SQUARE_SIDE, transform } from '../../squared-paper/squared-paper.component';
import { Cell, CrosswordBoard } from './crossword-board';
import { CrosswordBoardService } from './crossword-board.service';

enum Axis { x = 0, y = 1 }

type Tile = Cell & {
  order: number;
  transform: string;
  className: string;
};

type MouseState = TabListSelection & {
  x: number;
  y: number;
  time: number;
};

function makeTiles(board: Readonly<CrosswordBoard>, left: number, top: number, width: number): Tile[] {
  const { letters, plan } = board;

  const tiles: Tile[] = [];
  for (let i = 0; i < letters.length; i++) {
    for (const cell of plan[letters[i]]) {
      const x = left + i % width;
      const y = top + Math.floor(i / width);
      tiles.push({
        x, y,
        value: cell.value,
        order: tiles.length + 1,
        className: '',
        transform: transform(x, y)
      });
    }
  }

  return tiles;
}

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

type Layout = Readonly<ReturnType<typeof makeLayout>>;

const DRAG_THRESHOLD = 4;

type DragData = {
  index: number;
  dragged?: boolean;
};

function makeLines(cells: ReadonlyArray<Readonly<Cell>>, left: number, top: number) {
  const buf = [] as string[][];
  for (const cell of cells) {
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
  return buf;
}

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

function makeFillPath(cells: ReadonlyArray<Readonly<Cell>>, layout: Readonly<Layout>): string {
  const pad = layout.pad;
  const left = layout.baseLeft;
  const top = layout.baseTop;
  const width = layout.baseRight - left + pad + pad;
  const height = layout.baseBottom - top + pad + pad;

  const lines = makeLines(cells, left, top);
  mergeLines(lines);

  let path = `M${left - pad} ${top - pad}v${height}h${width}v${-height}z`;
  for (const shape of lines) {
    path += 'M' + shape.join(' ') + (shape[0] === shape[shape.length - 1] ? 'z' : ' ');
  }
  return path;
}

function makeFailPath(
  tiles: ReadonlyArray<Readonly<Tile>>,
  layout: Readonly<Layout>,
  showMistakes?: boolean,
  skip?: Readonly<Tile>
  ): string {
  const pad = layout.pad;
  const left = layout.baseLeft - pad;
  const right = layout.baseRight + pad;
  const top = layout.baseTop - pad;
  const bottom = layout.baseBottom + pad;

  const fails: {[key: string]: boolean} = {};

  let failPath = '';
  for (const tile of tiles) {
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
        || (showMistakes && tile.value !== tile.list.head.value)) {
        const path = `M${tile.x} ${tile.y}h1v1h-1z`;
        if (!fails[path]) {
          fails[path] = true;
          failPath += path;
        }
      }
    }
  }
  return failPath;
}

@Component({
  selector: 'app-crossword-board',
  templateUrl: './crossword-board.component.html',
  styleUrls: ['./crossword-board.component.scss']
})
export class CrosswordBoardComponent implements OnInit, OnDestroy {
  private _mouse?: MouseState; // Word on click selection workaround.
  private _dragListener = new DragListener<DragData>();
  private _player = new Autoplay();
  private _selection: TabListSelection;
  private _subs: Subscription[] = [];

  tiles: Tile[];
  layout: Layout;
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

  @Output() selectionChange = new EventEmitter<TabListSelection>();

  get isSolved(): boolean | undefined {
    const state = this.boardService.state;
    return state.showMistakes && state.board?.isSolved;
  }

  constructor(public boardService: CrosswordBoardService, private _renderer: Renderer2) {}

  ngOnInit(): void {
    this._subs.push(this._dragListener.dragChange.subscribe(event => {
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
    }));

    this._subs.push(this.boardService.subscribe((state) => {
      if (state.board) {
        if (this.boardService.previousState.board !== state.board) {
          this._onNewPuzzle();
        } else if (state.stage === 'live' && state.showMistakes && !this.boardService.previousState.showMistakes) {
          this._onBoardChange();
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this._player.stop();

    for (const sub of this._subs) {
      sub.unsubscribe();
    }
    this._subs.length = 0;
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
    const board = this.boardService.state.board;
    if (board) {
      const itemIndex = board.getXWordIndex(x, y);
      if (itemIndex >= 0) {
        return { groupIndex: Axis.x, itemIndex };
      }
    }
    return null;
  }

  getYItemIndex(x: number, y: number): TabListSelection | null {
    const board = this.boardService.state.board;
    if (board) {
      const itemIndex = board.getYWordIndex(x, y);
      if (itemIndex >= 0) {
        return { groupIndex: Axis.y, itemIndex };
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

    const x = Math.floor((event.clientX - rc.left) / SQUARE_SIDE) - this.layout.baseLeft;
    const y = Math.floor((event.clientY - rc.top) / SQUARE_SIDE) - this.layout.baseTop;

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

  private _playIntro() {
    const { board, difficulty } = this.boardService.state;
    const layout = this.layout;

    const tiles = makeTiles(board, layout.bankLeft, layout.bankTop, layout.bankRight - layout.bankLeft);

    let count = 0;
    this._player.timeout = 50;
    this._player.play(() => {
      if (count < board.letters.length) {
        const value = board.letters[count];
        this.tiles = this.tiles.concat(tiles.filter((tile) => tile.value === value));
        count++;
        this.boardService.set({ stage: 'init' });
        return true;
      } else {
        this._setBase(board.cells, difficulty);
        this.fillPath = makeFillPath(board.cells, layout);
        this.boardService.set({ stage: 'live' });
        return false;
      }
    });
  }

  private _setBase(cells: ReadonlyArray<Cell>, difficulty: number) {
    // Activate all the tiles
    for (const tile of this.tiles) {
      tile.isActive = true;
    }
    // Move tiles to the base (except intersections).
    const left = this.layout.baseLeft;
    const top = this.layout.baseTop;

    for (const cell of cells) {
      cell.isActive = (Math.random() < difficulty) ||
        ((cell.hasBottom || cell.hasTop) && (cell.hasLeft || cell.hasRight));
      if (!cell.isActive) {
        const tile = this.tiles.find((it) => it.isActive && it.value === cell.value);

        if (tile) {
          cell.isStatic = true;

          tile.isActive = false;
          tile.x = cell.x + left;
          tile.y = cell.y + top;
          tile.transform = transform(tile.x, tile.y);
          tile.className = 'transition_deal';

          append(cell, tile);
        } else {
          // Somehow someone was fast enough to deactivate the dedicated tile before intro finish.
          // It's impossible. But the linter doesn't understand this. Let's reactivate the cell.
          cell.isActive = true;
        }
      }
    }
  }

  private _setFailPath() {
    const showMistakes = this.boardService.state.showMistakes;
    // skip dragged tile, if any
    const skip = (this._dragListener.isDragging && this._dragListener.data) ?
      this.tiles[this._dragListener.data.index] : undefined;

    this.failPath = makeFailPath(this.tiles, this.layout, showMistakes, skip);
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
    const board = this.boardService.state.board;
    if (tile && board) {
      let x = Math.round(tile.x + this._dragListener.pageDeltaX / SQUARE_SIDE);
      x = Math.max(0, Math.min(this.layout.width - 1, x));
      let y = Math.round(tile.y + this._dragListener.pageDeltaY / SQUARE_SIDE);
      y = Math.max(0, Math.min(this.layout.height - 1, y));

      tile.x = x;
      tile.y = y;
      tile.className = 'transition_fast';
      tile.transform = transform(tile.x, tile.y);

      const x0 = x - this.layout.baseLeft;
      const y0 = y - this.layout.baseTop;
      const cell = board.findCell(x0, y0);
      if (cell) {
        append(cell, tile);
      } else {
        detach(tile);

        // Auto move the tile into selected word.
        if (!data.dragged && this._selection) {
          this._moveAuto(tile);
        }
      }

      this._onBoardChange();
    }
  }

  private _onBoardChange(): void {
    this._setMistakes();
    this._setFailPath();

    if (this.isSolved) {
      this._player.timeout = 500;
      this._player.play(() => {
        this.boardService.set({ stage: 'done' });
        return false;
      });
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
    const board = this.boardService.state.board;
    if (board && this._selection) {
      const { groupIndex, itemIndex } = this._selection;
      if (groupIndex === Axis.x) {
        return board.getXWordFreeCell(itemIndex);
      } else if (groupIndex === Axis.y) {
        return board.getYWordFreeCell(itemIndex);
      }
    }
    return undefined;
  }

  private _getSelectionPath() {
    const board = this.boardService.state.board;
    if (board && this._selection) {
      const { groupIndex, itemIndex } = this._selection;
      if (groupIndex === Axis.x) {
        const wx = board.xWords[itemIndex];
        if (wx) {
          const x = this.layout.baseLeft + wx.x;
          const y = this.layout.baseTop + wx.y + 1;
          return `M${x} ${y}v-1h${wx.letters.length}v1z`;
        }
      } else if (groupIndex === Axis.y) {
        const wy = board.yWords[itemIndex];
        if (wy) {
          const x = this.layout.baseLeft + wy.x;
          const y = this.layout.baseTop + wy.y;
          return `M${x} ${y}h1v${wy.letters.length}h-1z`;
        }
      }
    }
    return '';
  }

  private _setMistakes() {
    const { showMistakes, board } = this.boardService.state;
    if (showMistakes && board) {
      const { baseLeft, baseTop, bankLeft, bankTop, bankRight } = this.layout;
      const bankWidth = bankRight - bankLeft;

      for (const cell of board.cells) {
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

            const i = board.findLetterIndex(extra.value);
            extra.x = bankLeft + i % bankWidth;
            extra.y = bankTop + Math.floor(i / bankWidth);
            extra.transform = transform(extra.x, extra.y);
            extra.className = 'transition_norm';
          }
        }
      }
    }
  }

  private _onNewPuzzle() {
    this._player.stop();

    const { cols, rows, letters } = this.boardService.state.board;

    this.tiles = [];
    this.fillPath = '';
    this.failPath = '';
    this.layout = makeLayout(cols, rows, letters.length);
    this._playIntro();
  }
}
