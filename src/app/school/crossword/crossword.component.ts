// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';

import { createSifter, makePuzzles, toCWArray } from './crossword-model';
import { CellState } from './crossword-board/crossword-board.component';

import * as DATA from 'src/assets/school/english/crossword/spotlight-3.json';
import { randomItem, shuffle } from 'src/app/common/array-utils';
import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';
import { CrosswordMakerService } from './services/crossword-maker.service';

// const DICT = DATA['Starter Unit'];
// const KEYS = Object.keys(DICT);

function makeGrid(words: string[]) {
  const sifter = createSifter(500, 2500);
  for (let i = 0; i < 100; i++) {
    shuffle(words);
    // console.log(`Seed: ${words[0]}`);
    const puzzles = makePuzzles(words, sifter);
    // console.log(puzzles.length);
    if (puzzles.length > 0) {
      return toCWArray(randomItem(puzzles));
    }
  }
  return [];
}

// export const PROJECT_VERSION = version;
// export const PROJECT_NAME = name;

// const TEST = 'begin,0,6,0;black,0,11,0;assault,1,3,0;astronomy,1,9,0;church,1,15,0;blazing,3,22,0;assassin,4,0,0;'
//   + 'abomination,7,5,0;chariots,7,17,0;apartment,9,7,0;believer,9,20,0;ball,10,14,0;blink,11,12,0;cable,12,24,0;'
//   + 'communication,15,3,0;brothers,15,9,0;catch,16,1,0;conjuring,17,14,0;cowardly,20,17,0;country,20,20,0;basketball,1,2,1;'
//   + 'citizen,1,15,1;courage,3,13,1;boy,3,22,1;avenger,4,3,1;christmas,5,15,1;abstraction,7,0,1;captain,7,17,1;'
//   + 'apocalypse,9,3,1;big,9,20,1;animal,11,3,1;beautiful,11,12,1;artificial,13,5,1;book,15,9,1;bridge,16,19,1;'
//   + 'ammunition,17,1,1;chicken,19,8,1;clueless,22,3,1;conservative,24,12,1;computer,26,2,1';

// function parse(puzzle: string): CWItem[] {
//   const buf: CWItem[] = [];
//   for (const item of puzzle.split(';')) {
//     const parts = item.split(',');
//     buf.push({
//       letters: parts[0].split(''),
//       x: +parts[1],
//       y: +parts[2],
//       vertical: parts[3] === '1'
//     });
//   }
//   return buf;
// }

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
  title = 'Module 1. Unit 1: School again!';
  data = [];

  clues: TabListGroup[] = [];
  selection: TabListSelection = { groupIndex: 0, itemIndex: -1 };
  selectedWordIndex = -1;

  constructor(private _puzzle: CrosswordMakerService) { }

  ngOnInit(): void {
    const u0 = DATA['Starter Unit'];
    const u1 = DATA['Module 1. Unit 1: School again!'];

    const toClue = (letters: string[]) => {
      const key = letters.join('');
      return u0[key] || u1[key];
    };

    this._puzzle.subscribe((state) => {
      if (state.isWorking) {
        this.data = [];
        this.clues = [];
        this.selection = { groupIndex: 0, itemIndex: -1 };
        this.selectedWordIndex = -1;
      } else {
        const data = state.items.slice();
        data.sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);

        const across = data.filter((it) => !it.vertical);
        const down = data.filter((it) => it.vertical);

        this.data = across.concat(down);
        this.clues = [
          { label: 'Across', items: across.map((it) => toClue(it.letters)) },
          { label: 'Down', items: down.map((it) => toClue(it.letters)) }
        ];
        this.selection = { groupIndex: 0, itemIndex: -1 };
        this.selectedWordIndex = -1;
      }
    });
  }

  onBoardChange(state: CellState[]) {
    this.boardState = state.filter((cell) => cell.isActive && cell.value !== cell.answer);
  }

  onReset() {
    const u0 = DATA['Starter Unit'];
    const u1 = DATA['Module 1. Unit 1: School again!'];

    // const toClue = (letters: string[]) => {
    //   const key = letters.join('');
    //   return u0[key] || u1[key];
    // };

    this._puzzle.makePuzzle(Object.keys(u0).concat(Object.keys(u1)));

    // const data = makeGrid(Object.keys(u0).concat(Object.keys(u1)));
    // data.sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);

    // const across = data.filter((it) => !it.vertical);
    // const down = data.filter((it) => it.vertical);

    // this.data = across.concat(down);
    // this.clues = [
    //   { label: 'Across', items: across.map((it) => toClue(it.letters)) },
    //   { label: 'Down', items: down.map((it) => toClue(it.letters)) }
    // ];
    // this.selection = { groupIndex: 0, itemIndex: -1 };
    // this.selectedWordIndex = -1;
  }

  onClueSelectionChange(selection: TabListSelection) {
    if (this.selection.groupIndex === selection.groupIndex &&
      this.clues[selection.groupIndex].selection === selection.itemIndex) {
      // Unselect this item.
      selection.itemIndex = -1;
    }
    this.clues[selection.groupIndex].selection = this.selectedWordIndex = selection.itemIndex;
    if (selection.groupIndex === 1 && selection.itemIndex >= 0) {
      this.selectedWordIndex += this.clues[0].items.length;
    }
    this.selection = selection;
  }

  onWordSelectionChange(index: number) {
    const offset = this.clues[0].items.length;
    if (index < offset) {
      this.onClueSelectionChange({ groupIndex: 0, itemIndex: index });
    } else {
      this.onClueSelectionChange({ groupIndex: 1, itemIndex: index - offset });
    }
  }
}
