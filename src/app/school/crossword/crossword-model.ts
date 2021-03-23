import { Grader, pickSome } from 'src/app/common/array-utils';
import { Point } from 'src/app/common/math2d';

export type CWPoint = Point & {
  vertical?: boolean;
};

export type CWItem = CWPoint & {
  letters: string[];
};

export type CWNode = CWItem & {
  prev?: CWNode;
};

const GRID_PAD = 1; // 1: British/Australian-style grid; 0: American-style grid;
const GRID_ROW_END = '\n';
const GRID_SPACE = ' ';

// Item Info:
function isValidHVIntersection(a: Readonly<CWItem>, b: Readonly<CWItem>) {
  const dx = b.x - a.x;
  const dy = a.y - b.y;
  return dx >= 0 && dx < a.letters.length && dy >= 0 && dy < b.letters.length && a.letters[dx] === b.letters[dy];
}

export function isValidIntersection(a: Readonly<CWItem>, b: Readonly<CWItem>) {
  return (!a.vertical && b.vertical)
    ? isValidHVIntersection(a, b)
    : (a.vertical && !b.vertical)
      ? isValidHVIntersection(b, a)
      : false;
}

function canPairHV(a: Readonly<CWItem>, b: Readonly<CWItem>) {
  const dx = b.x - a.x;
  if (dx >= -GRID_PAD && dx < a.letters.length + GRID_PAD) {
    const dy = a.y - b.y;
    if (dy >= -GRID_PAD && dy < b.letters.length + GRID_PAD) {
      // We are in the zone. It should be a valid intersection.
      return dx >= 0 && dx < a.letters.length && dy >= 0 && dy < b.letters.length
        && a.letters[dx] === b.letters[dy];
    }
  }

  return true;
}

function canPairH(a: Readonly<CWItem>, b: Readonly<CWItem>): boolean {
  const dx = b.x - a.x;
  if (dx >= -b.letters.length - GRID_PAD && dx <= a.letters.length + GRID_PAD) {
    const dy = a.y - b.y;
    return dy < -GRID_PAD || dy > GRID_PAD;
  }

  return true;
}

function canPairV(a: Readonly<CWItem>, b: Readonly<CWItem>): boolean {
  const dy = a.y - b.y;
  if (dy >= -a.letters.length - GRID_PAD && dy <= b.letters.length + GRID_PAD) {
    const dx = b.x - a.x;
    return dx < -GRID_PAD || dx > GRID_PAD;
  }

  return true;
}

export function canPair(a: Readonly<CWItem>, b: Readonly<CWItem>): boolean {
  return a.vertical ? (b.vertical ? canPairV(a, b) : canPairHV(b, a))
    : (b.vertical ? canPairHV(a, b) : canPairH(a, b));
}

export function getItemWidth(a: Readonly<CWItem>) {
  return a.vertical ? 1 : a.letters.length;
}

export function getItemHeight(a: Readonly<CWItem>) {
  return a.vertical ? a.letters.length : 1;
}

// Node Info:
export function getMinLeft(node: Readonly<CWNode>): number {
  let x = node.x;
  // I'm not hugely fond of conditional assignments, but the alternative is much uglier.
  // tslint:disable-next-line: no-conditional-assignment
  while (node = node.prev) {
    x = Math.min(x, node.x);
  }
  return x;
}

export function getMinTop(node: Readonly<CWNode>): number {
  let y = node.y;
  // tslint:disable-next-line: no-conditional-assignment
  while (node = node.prev) {
    y = Math.min(y, node.y);
  }
  return y;
}

export function getMaxRight(node: Readonly<CWNode>): number {
  let x = node.x + getItemWidth(node);
  // tslint:disable-next-line: no-conditional-assignment
  while (node = node.prev) {
    x = Math.max(x, node.x + getItemWidth(node));
  }
  return x;
}

export function getMaxBottom(node: Readonly<CWNode>): number {
  let y = node.y + getItemHeight(node);
  // tslint:disable-next-line: no-conditional-assignment
  while (node = node.prev) {
    y = Math.max(y, node.y + getItemHeight(node));
  }
  return y;
}

export function getArea(node: Readonly<CWNode>): number {
  return (getMaxRight(node) - getMinLeft(node)) * (getMaxBottom(node) - getMinTop(node));
}

export function getSizeDiff(node: Readonly<CWNode>): number {
  return getMaxRight(node) + getMinTop(node) - getMinLeft(node) - getMaxBottom(node);
}

export function getWordCount(node: Readonly<CWNode>): number {
  let count = 1;
  // tslint:disable-next-line: no-conditional-assignment
  while (node = node.prev) {
    count++;
  }
  return count;
}

export function getHWordCount(node: Readonly<CWNode>): number {
  let count = 0;
  do {
    if (!node.vertical) {
      count += 1;
    }
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
  return count;
}

export function getVWordCount(node: Readonly<CWNode>): number {
  let count = 0;
  do {
    if (node.vertical) {
      count += 1;
    }
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
  return count;
}

export function getWordDiff(node: Readonly<CWNode>): number {
  let diff = 0;
  do {
    diff += node.vertical ? -1 : 1;
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
  return diff;
}

export function getIntersectionCount(node: Readonly<CWNode>): number {
  let count = 0;

  for (; node; node = node.prev) {
    for (let prev = node.prev; prev; prev = prev.prev) {
      if (isValidIntersection(node, prev)) {
        count += 1;
      }
    }
  }

  return count;
}

export function toCWString(node: Readonly<CWNode>): string {
  const x0 = getMinLeft(node);
  const x1 = getMaxRight(node);

  const y0 = getMinTop(node);
  const y1 = getMaxBottom(node);

  const rows = x1 - x0 + 1;
  const grid: string[] = new Array(rows * (y1 - y0));
  for (let i = grid.length; i-- > 0;) {
    grid[i] = (i + 1) % rows ? GRID_SPACE : GRID_ROW_END;
  }

  // Fill-up the grid.
  do {
    const k = (node.y - y0) * rows + node.x - x0;
    for (let i = node.letters.length; i-- > 0;) {
      grid[k + (node.vertical ? i * rows : i)] = node.letters[i];
    }
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);

  return grid.join('');
}

export function toCWArray(node: Readonly<CWNode>): CWItem[] {
  const items: CWItem[] = [];

  const left = getMinLeft(node);
  const top = getMinTop(node);
  do {
    items.push({ x: node.x - left, y: node.y - top, letters: node.letters, vertical: node.vertical });
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
  return items;
}

export function canAdd(node: Readonly<CWNode>, entry: Readonly<CWItem>) {
  do {
    if (!canPair(node, entry)) {
      return false;
    }
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
  return true;
}

export function getNext(last: Readonly<CWNode>, letters: string[], accum: CWNode[]) {
  const done: { [key: string]: boolean } = {};
  let node = last;
  do {
    for (let i = node.letters.length; i-- > 0;) {
      const a = node.letters[i];
      for (let j = letters.length; j-- > 0;) {
        if (a === letters[j]) {
          const next: CWNode = node.vertical
            ? { x: node.x - j, y: node.y + i, letters, prev: last }
            : { x: node.x + i, y: node.y - j, letters, prev: last, vertical: true };
          const key = `${next.x}:${next.y}`;
          if (!done[key]) {
            done[key] = true;
            if (canAdd(last, next)) {
              accum.push(next);
            }
          }
        }
      }
    }
    // tslint:disable-next-line: no-conditional-assignment
  } while (node = node.prev);
}

export type PuzzleIterator = (words: string[], index: number, output: CWNode[]) => CWNode[];

export function makePuzzles(words: string[], iterator: PuzzleIterator): CWNode[] {
  let input: CWNode[] = [{ x: 0, y: 0, letters: words[0].split('') }];

  for (let i = 1; i < words.length; i++) {
    const output: CWNode[] = [];
    for (const node of iterator(words, i, input)) {
      getNext(node, words[i].split(''), output);
    }
    input = output;
  }
  return iterator(words, words.length, input);
}

function sortAsNumbers(keys: string[]): number[] {
  return keys.map(value => +value).sort((a, b) => a - b);
}

function descendingSortAsNumbers(keys: string[]): number[] {
  return keys.map(value => +value).sort((a, b) => b - a);
}

export function createIterator(minSize: number, maxSize: number): PuzzleIterator {
  // Min Area.
  const aGrader: Grader<CWNode> = {
    mapper: getArea,
    picker: sortAsNumbers
  };
  // Close to Square (Min width-height difference).
  const bGrader: Grader<CWNode> = {
    mapper: (item) => Math.abs(getSizeDiff(item)),
    picker: sortAsNumbers
  };
  // Max intersection count.
  const cGrader: Grader<CWNode> = {
    mapper: getIntersectionCount,
    picker: descendingSortAsNumbers
  };
  // Min horizontal-vertical difference.
  const dGrader: Grader<CWNode> = {
    mapper: (item) => Math.abs(getWordDiff(item)),
    picker: sortAsNumbers
  };

  let limit = 2 * maxSize;

  return (words: string[], index: number, output: CWNode[]): CWNode[] => {
    if (index >= words.length) {
      // console.log(`Done! Will pick from: ${output.length}`);
      // Area -> Count -> Difference -> Balance
      (((aGrader.fallback = cGrader
        ).fallback = dGrader
        ).fallback = bGrader
        ).fallback = undefined;
      return pickSome(output, 1, aGrader);
    }

    // let log = `#${index}\tGrids: ${output.length}`;
    if (index > 4) {
      if (output.length > limit) {
        limit = maxSize;
        if (index > 0.85 * words.length) {
          // Area -> Count -> Balance -> Difference
          (((aGrader.fallback = cGrader
            ).fallback = bGrader
            ).fallback = dGrader
            ).fallback = undefined;
          output = pickSome(output, minSize, aGrader);
        } else {
          // Count -> Area -> Difference -> Balance
          (((cGrader.fallback = aGrader
            ).fallback = dGrader
            ).fallback = bGrader
            ).fallback = undefined;
          output = pickSome(output, minSize, cGrader);
        }
        if (output.length > limit) {
          output.length = limit;
        }
        // log += ` -> ${output.length}`;
      }
    }
    // console.log(`${log}\tNext: ${words[index]}`);
    return output;
  };
}
