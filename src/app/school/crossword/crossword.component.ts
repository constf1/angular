// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';

import { CWItem } from './crossword-model';
import { CellState } from './crossword-board/crossword-board.component';

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

// const ASSETS_URL = 'assets/school/crossword/';

// function disinfect(resourceName: any): string {
//   const RE_FORBIDDEN_CHARS = /[^a-z\-_\.0-9]+/gmi;
//   return ('' + resourceName).replace(RE_FORBIDDEN_CHARS, '');
// }

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.scss']
})
export class CrosswordComponent implements OnInit {
  boardState: CellState[];
  data = parse(TEST);

  constructor() { }

  ngOnInit(): void {
  }

  onBoardChange(state: CellState[]) {
    this.boardState = state.filter((cell) => cell.isActive && cell.value !== cell.answer);
  }
}
