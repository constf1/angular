import { Component, OnInit } from '@angular/core';
import { Point } from 'src/app/common/math2d';

import { CWItem, getItemHeight, getItemWidth } from './crossword-model';

const TEST = 'begin,0,6,0;black,0,11,0;assault,1,3,0;astronomy,1,9,0;church,1,15,0;blazing,3,22,0;assassin,4,0,0;'
  + 'abomination,7,5,0;chariots,7,17,0;apartment,9,7,0;believer,9,20,0;ball,10,14,0;blink,11,12,0;cable,12,24,0;'
  + 'communication,15,3,0;brothers,15,9,0;catch,16,1,0;conjuring,17,14,0;cowardly,20,17,0;country,20,20,0;basketball,1,2,1;'
  + 'citizen,1,15,1;courage,3,13,1;boy,3,22,1;avenger,4,3,1;christmas,5,15,1;abstraction,7,0,1;captain,7,17,1;'
  + 'apocalypse,9,3,1;big,9,20,1;animal,11,3,1;beautiful,11,12,1;artificial,13,5,1;book,15,9,1;bridge,16,19,1;'
  + 'ammunition,17,1,1;chicken,19,8,1;clueless,22,3,1;conservative,24,12,1;computer,26,2,1';

function parse(puzzle: string): CWItem[] {
  const buf: CWItem[] = [];
  for (const item of puzzle.split(';')) {
    const parts = item.split(',');
    buf.push({
      letters: parts[0].split(''),
      x: +parts[1],
      y: +parts[2],
      vertical: parts[3] === '1'
    });
  }
  return buf;
}

function createGame(items: CWItem[]) {
  let cols = 0;
  let rows = 0;
  const cells = [] as CWCell[];

  for (const item of items) {
    cols = Math.max(cols, item.x + getItemWidth(item));
    rows = Math.max(rows, item.y + getItemHeight(item));
    for (let i = item.letters.length; i-- > 0; ) {
      let x: number;
      let y: number;
      if (item.vertical) {
        x = item.x;
        y = item.y + i;
      } else {
        x = item.x + i;
        y = item.y;
      }

      let index = cells.findIndex((c) => c.x === x && c.y === y);
      if (index < 0) {
        index = cells.length;
        cells.push({ x, y, value: item.letters[i]});
      }
      if (item.vertical) {
        cells[index].hasTop = i > 0;
        cells[index].hasBottom = i < item.letters.length - 1;
      } else {
        cells[index].hasLeft = i > 0;
        cells[index].hasRight = i < item.letters.length - 1;
      }
    }
  }

  // Hide intersections:
  for (const cell of cells) {
    cell.isHidden = (cell.hasBottom || cell.hasTop) && (cell.hasLeft || cell.hasRight);
  }

  return  { cols, rows, cells, items };
}

function makeFrame(x: number, y: number, width: number, height: number) {
  return `M${x} ${y}v${height}h${width}v${-height}z`;
}

function makePath(cells: ReadonlyArray<CWCell>): string {
  const lines = getLines(cells);
  // console.log('Line count:', lines.length);
  mergeLines(lines);
  // console.log('Shape count:', lines.length);
  let path = '';
  for (const shape of lines) {
    path += 'M' + shape.join(' ') + (shape[0] === shape[shape.length - 1] ? 'z' : ' ');
  }
  // console.log(path);
  return path;
}

function getLines(cells: ReadonlyArray<CWCell>) {
  const buf = [] as string[][];

  for (const cell of cells) {
    if (!cell.hasTop) {
      buf.push([`${cell.x},${cell.y}`, `${cell.x + 1},${cell.y}`]);
    }
    if (!cell.hasRight) {
      buf.push([`${cell.x + 1},${cell.y}`, `${cell.x + 1},${cell.y + 1}`]);
    }
    if (!cell.hasBottom) {
      buf.push([`${cell.x + 1},${cell.y + 1}`, `${cell.x},${cell.y + 1}`]);
    }
    if (!cell.hasLeft) {
      buf.push([`${cell.x},${cell.y + 1}`, `${cell.x},${cell.y}`]);
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

type CWCell = Point & {
  value: string;
  isHidden?: boolean;
  // neighbours, if any
  hasLeft?: boolean;
  hasRight?: boolean;
  hasTop?: boolean;
  hasBottom?: boolean;
};

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.scss']
})
export class CrosswordComponent implements OnInit {
  game = createGame(parse(TEST));
  pathFrame = makeFrame(-1, -1, this.game.cols + 2, this.game.rows + 2) + makePath(this.game.cells);

  constructor() { }

  ngOnInit(): void {
  }
}
