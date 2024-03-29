/* eslint-disable prefer-arrow/prefer-arrow-functions */

// import { Subject } from 'rxjs';

import { Linkable } from 'src/app/common/linkable';
import { Point } from 'src/app/common/math2d';
import { Word } from './crossword-model';

export type Cell = Linkable<Cell> & Point & {
  value: string;
  isActive?: boolean;
  isStatic?: boolean;
  hasError?: boolean;
  // neighbours, if any
  hasLeft?: boolean;
  hasRight?: boolean;
  hasTop?: boolean;
  hasBottom?: boolean;
};

export type Item = Word & {
  clue: string;
  cells: Cell[];
};

export type CellMap = {
  [key: string]: Cell[];
};

function getCell(plan: CellMap, value: string, x: number, y: number): Cell {
  const row = plan[value] || (plan[value] = []);
  for (const cell of row) {
    if (x === cell.x && y === cell.y) {
      return cell;
    }
  }
  const next: Cell = { x, y, value };
  row.push(next);
  return next;
}

// export type BoardEvent = 'init' | 'move' | 'done';

export class CrosswordGame {
  // private readonly _events = new Subject<BoardEvent>();

  // get boardChange() {
  //   return this._events.asObservable();
  // }

  readonly cells: ReadonlyArray<Cell>;
  readonly letters: ReadonlyArray<string>;
  readonly plan: Readonly<CellMap>;

  get isSolved(): boolean {
    for (const cell of this.cells) {
      if (!cell.next || cell.next.value !== cell.value) {
        return false;
      }
    }
    return true;
  }

  get hasMistake(): boolean {
    for (const cell of this.cells) {
      if (cell.next && cell.next.value !== cell.value) {
        return true;
      }
    }
    return false;
  }

  get countSolved(): number {
    let count = 0;
    for (const cell of this.cells) {
      if (!(cell.isStatic || cell.hasError) && cell.next && cell.next.value === cell.value) {
        count += 1;
      }
    }
    return count;
  }

  get countStatic(): number {
    let count = 0;
    for (const cell of this.cells) {
      if (cell.isStatic) {
        count += 1;
      }
    }
    return count;
  }

  get countActive(): number {
    let count = 0;
    for (const cell of this.cells) {
      if (cell.isActive) {
        count += 1;
      }
    }
    return count;
  }

  get progress(): number {
    const count = this.cells.length - this.countStatic;
    return count > 0 ? (100 * (count - this.countActive) / count) : 0;
  }

  constructor(
    readonly cols: number,
    readonly rows: number,
    readonly xItems: ReadonlyArray<Item>,
    readonly yItems: ReadonlyArray<Item>) {

    const plan: CellMap = {};
    for (const item of xItems) {
      item.cells.length = 0;
      for (let dx = item.letters.length; dx-- > 0;) {
        const cell = getCell(plan, item.letters[dx], item.x + dx, item.y);
        cell.hasLeft = dx > 0;
        cell.hasRight = dx < item.letters.length - 1;
        item.cells[dx] = cell;
      }
    }

    for (const item of yItems) {
      item.cells.length = 0;
      for (let dy = item.letters.length; dy-- > 0;) {
        const cell = getCell(plan, item.letters[dy], item.x, item.y + dy);
        cell.hasTop = dy > 0;
        cell.hasBottom = dy < item.letters.length - 1;
        item.cells[dy] = cell;
      }
    }

    const letters = Object.keys(plan).sort();

    const cells: Cell[] = [];
    for (const key of letters) {
      for (const cell of plan[key]) {
        cells.push(cell);
      }
    }

    this.cells = cells;
    this.letters = letters;
    this.plan = plan;
  }

  getItem(groupIndex: number, itemIndex: number): Item | undefined {
    return groupIndex === 0
      ? this.xItems[itemIndex]
      : groupIndex === 1
        ? this.yItems[itemIndex]
        : undefined;
  }

  findCell(x: number, y: number): Cell | undefined {
    for (const cell of this.cells) {
      if (cell.x === x && cell.y === y) {
        return cell;
      }
    }
    return undefined;
  }

  getXWordIndex(x: number, y: number): number {
    for (let index = this.xItems.length; index-- > 0;) {
      const wx = this.xItems[index];
      if (y === wx.y && x >= wx.x && x < wx.x + wx.letters.length) {
        return index;
      }
    }
    return -1;
  }

  getYWordIndex(x: number, y: number): number {
    for (let index = this.yItems.length; index-- > 0;) {
      const wy = this.yItems[index];
      if (x === wy.x && y >= wy.y && y < wy.y + wy.letters.length) {
        return index;
      }
    }
    return -1;
  }

  getXWordFreeCell(index: number): Cell | undefined {
    const item = this.xItems[index];
    if (item) {
      for (const cell of item.cells) {
        if (cell && !cell.next) {
          return cell;
        }
      }
    }
    return undefined;
  }

  getYWordFreeCell(index: number): Cell | undefined {
    const item = this.yItems[index];
    if (item) {
      for (const cell of item.cells) {
        if (cell && !cell.next) {
          return cell;
        }
      }
    }
    return undefined;
  }

  findLetterIndex(letter: string): number {
    const letters = this.letters;
    let index = letters.length;
    while (index-- > 0 && letter !== letters[index]) {
    }
    return index;
  }

  markErrors(): void {
    for (const cell of this.cells) {
      if (cell.isActive && cell.next && cell.next.value !== cell.value) {
        cell.hasError = true;
      }
    }
  }

  getSolvedXWordIndices(): number[] {
    const indices = this.xItems.map((_, index) => index);
    for (const cell of this.cells) {
      if (cell.hasError || cell.next?.value !== cell.value) {
        const i = this.getXWordIndex(cell.x, cell.y);
        if (i >= 0) {
          indices[i] = -1;
        }
      }
    }
    return indices.filter((index) => index >= 0);
  }

  getSolvedYWordIndices(): number[] {
    const indices = this.yItems.map((_, index) => index);
    for (const cell of this.cells) {
      if (cell.hasError || cell.next?.value !== cell.value) {
        const i = this.getYWordIndex(cell.x, cell.y);
        if (i >= 0) {
          indices[i] = -1;
        }
      }
    }
    return indices.filter((index) => index >= 0);
  }

  // emit(event: BoardEvent): void {
  //   this._events.next(event);
  // }
}
