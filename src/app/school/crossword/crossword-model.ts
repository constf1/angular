import { Grader, pickSome } from 'src/app/common/array-utils';
import { Point } from 'src/app/common/math2d';

export type Word = Point & {
  letters: string[];
};

export type Grid = {
  xWords: Word[];
  yWords: Word[];

  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const GRID_PAD = 1; // 1: British/Australian-style grid; 0: American-style grid;
const GRID_ROW_END = '\n';
const GRID_SPACE = ' ';

export function normalize(words: ReadonlyArray<Readonly<Word>>, dx: number, dy: number): Word[] {
  return words
    .map((wx) => ({ x: wx.x + dx, y: wx.y + dy, letters: wx.letters }))
    .sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
}

function isIntersectionXY(wx: Readonly<Word>, wy: Readonly<Word>): boolean {
  const dx = wy.x - wx.x;
  const dy = wx.y - wy.y;
  return dx >= 0 && dx < wx.letters.length && dy >= 0 && dy < wy.letters.length;
}

function canPairXY(wx: Readonly<Word>, wy: Readonly<Word>) {
  const dx = wy.x - wx.x;
  if (dx >= -GRID_PAD && dx < wx.letters.length + GRID_PAD) {
    const dy = wx.y - wy.y;
    if (dy >= -GRID_PAD && dy < wy.letters.length + GRID_PAD) {
      // We are in the zone. It should be a valid intersection.
      return dx >= 0 && dx < wx.letters.length && dy >= 0 && dy < wy.letters.length
        && wx.letters[dx] === wy.letters[dy];
    }
  }
  return true;
}

function canPairX(wx1: Readonly<Word>, wx2: Readonly<Word>): boolean {
  const dx = wx2.x - wx1.x;
  if (dx >= -wx2.letters.length - GRID_PAD && dx <= wx1.letters.length + GRID_PAD) {
    const dy = wx1.y - wx2.y;
    return dy < -GRID_PAD || dy > GRID_PAD;
  }
  return true;
}

function canPairY(wy1: Readonly<Word>, wy2: Readonly<Word>): boolean {
  const dy = wy1.y - wy2.y;
  if (dy >= -wy1.letters.length - GRID_PAD && dy <= wy2.letters.length + GRID_PAD) {
    const dx = wy2.x - wy1.x;
    return dx < -GRID_PAD || dx > GRID_PAD;
  }
  return true;
}

function canAddY(grid: Readonly<Grid>, yWord: Readonly<Word>) {
  for (const wy of grid.yWords) {
    if (!canPairY(wy, yWord)) {
      return false;
    }
  }
  for (const wx of grid.xWords) {
    if (!canPairXY(wx, yWord)) {
      return false;
    }
  }
  return true;
}

function canAddX(grid: Readonly<Grid>, xWord: Readonly<Word>) {
  for (const wx of grid.xWords) {
    if (!canPairX(wx, xWord)) {
      return false;
    }
  }
  for (const wy of grid.yWords) {
    if (!canPairXY(xWord, wy)) {
      return false;
    }
  }
  return true;
}

function getNextY(grid: Readonly<Grid>, letters: string[], accum: Grid[]) {
  const done: { [key: string]: boolean } = {};

  for (const wx of grid.xWords) {
    for (let dx = wx.letters.length; dx-- > 0;) {
      for (let dy = letters.length; dy-- > 0;) {
        if (wx.letters[dx] === letters[dy]) {
          const x = wx.x + dx;
          const y = wx.y - dy;
          const key = `${x}Y${y}`;
          if (!done[key]) {
            done[key] = true;
            const yWord: Word = { letters, x, y };
            if (canAddY(grid, yWord)) {
              accum.push({
                xWords: grid.xWords,
                yWords: [...grid.yWords, yWord],
                xMin: grid.xMin,
                xMax: grid.xMax,
                yMin: Math.min(grid.yMin, yWord.y),
                yMax: Math.max(grid.yMax, yWord.y + yWord.letters.length)
              });
            }
          }
        }
      }
    }
  }
}

function getNextX(grid: Readonly<Grid>, letters: string[], accum: Grid[]) {
  const done: { [key: string]: boolean } = {};

  for (const wy of grid.yWords) {
    for (let dy = wy.letters.length; dy-- > 0;) {
      for (let dx = letters.length; dx-- > 0;) {
        if (wy.letters[dy] === letters[dx]) {
          const x = wy.x - dx;
          const y = wy.y + dy;
          const key = `${x}X${y}`;
          if (!done[key]) {
            done[key] = true;
            const xWord: Word = { letters, x, y };
            if (canAddX(grid, xWord)) {
              accum.push({
                xWords: [...grid.xWords, xWord],
                yWords: grid.yWords,
                xMin: Math.min(grid.xMin, xWord.x),
                xMax: Math.max(grid.xMax, xWord.x + xWord.letters.length),
                yMin: grid.yMin,
                yMax: grid.yMax
              });
            }
          }
        }
      }
    }
  }
}

export function getNext(grid: Readonly<Grid>, letters: string[], accum: Grid[]) {
  getNextY(grid, letters, accum);
  getNextX(grid, letters, accum);
}
function getArea(grid: Readonly<Grid>): number {
  return (grid.xMax - grid.xMin) * (grid.yMax - grid.yMin);
}

function getSizeDiff(grid: Readonly<Grid>): number {
  return grid.xMax - grid.xMin - grid.yMax + grid.yMin;
}

function getIntersectionCount(grid: Readonly<Grid>): number {
  let count = 0;

  for (const wx of grid.xWords) {
    for (const wy of grid.yWords) {
      if (isIntersectionXY(wx, wy)) {
        count += 1;
      }
    }
  }
  return count;
}

type PuzzleSifter = (words: string[], index: number, output: Grid[]) => Grid[];

function makePuzzles(words: string[], sift: PuzzleSifter): Grid[] {
  const letters = words[0].split('');
  let input: Grid[] = [{
    xWords: [{ letters, x: 0, y: 0 }],
    yWords: [],
    xMin: 0,
    xMax: letters.length,
    yMin: 0,
    yMax: 1
  }];

  for (let i = 1; i < words.length; i++) {
    const output: Grid[] = [];
    for (const node of sift(words, i, input)) {
      getNext(node, words[i].split(''), output);
    }
    input = output;
  }
  return sift(words, words.length, input);
}

function sortAsNumbers(keys: string[]): number[] {
  return keys.map(value => +value).sort((a, b) => a - b);
}

function descendingSortAsNumbers(keys: string[]): number[] {
  return keys.map(value => +value).sort((a, b) => b - a);
}

export function createDefaultSifter(minSize: number, maxSize: number): PuzzleSifter {
  // Min Area.
  const aGrader: Grader<Grid> = {
    mapper: getArea,
    picker: sortAsNumbers
  };
  // Close to Square (Min width-height difference).
  const bGrader: Grader<Grid> = {
    mapper: (grid) => Math.abs(getSizeDiff(grid)),
    picker: sortAsNumbers
  };
  // Max intersection count.
  const cGrader: Grader<Grid> = {
    mapper: getIntersectionCount,
    picker: descendingSortAsNumbers
  };
  // Min horizontal-vertical difference.
  const dGrader: Grader<Grid> = {
    mapper: (grid) => Math.abs(grid.xWords.length - grid.yWords.length),
    picker: sortAsNumbers
  };

  let limit = 2 * maxSize;

  return (words: string[], index: number, output: Grid[]): Grid[] => {
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
        if (index > 0.9 * words.length) {
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

function asString(grid: Readonly<Grid>): string {
  const x0 = grid.xMin;
  const x1 = grid.xMax;

  const y0 = grid.yMin;
  const y1 = grid.yMax;

  const rows = x1 - x0 + 1;
  const buf: string[] = new Array(rows * (y1 - y0));
  for (let i = buf.length; i-- > 0;) {
    buf[i] = (i + 1) % rows ? GRID_SPACE : GRID_ROW_END;
  }

  // Fill-up the grid.
  for (const wx of grid.xWords) {
    const k = (wx.y - y0) * rows + wx.x - x0;
    for (let i = wx.letters.length; i-- > 0;) {
      buf[k + i] = wx.letters[i];
    }
  }
  for (const wy of grid.yWords) {
    const k = (wy.y - y0) * rows + wy.x - x0;
    for (let i = wy.letters.length; i-- > 0;) {
      buf[k + i * rows] = wy.letters[i];
    }
  }
  return buf.join('');
}
