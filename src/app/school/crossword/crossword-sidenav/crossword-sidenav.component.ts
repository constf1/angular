/* eslint-disable no-underscore-dangle */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';

import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';

import { CrosswordGameService } from '../services/crossword-game.service';
import { CrosswordCreateDialogComponent } from '../crossword-create-dialog/crossword-create-dialog.component';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';
import { CrosswordStatsDialogComponent } from '../crossword-stats-dialog/crossword-stats-dialog.component';
import { getStats } from '../crossword-stats';
import { toLetters } from '../crossword-model';
import { CrosswordBoardComponent } from '../crossword-board/crossword-board.component';

class InputState implements ErrorStateMatcher {
  value = '';
  error = '';
  isErrorState(): boolean {
    return !!this.error;
  }
  clear(): void {
    this.value = this.error = '';
  }
}

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss'],
  providers: [CrosswordGameService]
})
export class CrosswordSidenavComponent implements OnInit, OnDestroy {
  @ViewChild(CrosswordBoardComponent) boardComponent: CrosswordBoardComponent;

  clues: TabListGroup[];
  selection: TabListSelection = { groupIndex: 0, itemIndex: -1 };

  inputState = new InputState();

  get mode() {
    return this.settings.state.sidenavModeSide ? 'side' : 'over';
  }

  get closed() {
    return this.settings.state.sidenavClosed;
  }

  get opened() {
    return !this.settings.state.sidenavClosed;
  }

  get difficulty() {
    const lo = minState.crosswordDifficulty;
    const hi = maxState.crosswordDifficulty;
    const di = this.settings.state.crosswordDifficulty;
    return (di - lo) / (hi - lo);
  }

  get isInputDisabled() {
    const state = this.gamester.state;
    return !state.game || state.stage !== 'live';
  }

  get isActionDisabled() {
    const state = this.gamester.state;
    return !state.game || (state.showMistakes && state.stage !== 'done');
  }

  get showMistakes() {
    return this.gamester.state.showMistakes;
  }

  get showMistakesText() {
    const state = this.gamester.state;
    return state.stage !== 'done' ? state.showMistakes ? 'Checking' : 'Check' : 'Done!';
  }

  get showMistakesIcon() {
    const state = this.gamester.state;
    return state.stage !== 'done' ? 'mode' : 'done';
  }

  get showMistakesIconClassName() {
    const state = this.gamester.state;
    return state.stage !== 'done' ? state.showMistakes ? 'disabled-color' : 'mat-accent' : 'mat-warn';
  }

  get inputInfo(): string {
    const state = this.gamester.state;
    let text = state.stage === 'done' ? 'Answer: ' : 'Current value: ';

    if (state.game) {
      const { groupIndex, itemIndex } = this.selection;
      const item = state.game.getItem(groupIndex, itemIndex);
      if (item) {
        const mark = '※';
        text += item.cells.map((cell) => cell.next?.value || mark).join('');
      }
    }
    return text;
  }

  private _subscription: Subscription;

  constructor(
    public gamester: CrosswordGameService,
    public settings: CrosswordSettingsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this._subscription = this.gamester.stateChange.subscribe((state) => {
      if (state.stage === 'born') {
        this.clues = [
          { label: 'Across', items: state.game.xItems.map(it => it.clue) },
          { label: 'Down', items: state.game.yItems.map(it => it.clue) }
        ];
        // Reset selection
        this.onSelectionChange({ groupIndex: 0, itemIndex: -1 });
      } else if (state.stage === 'done') {
        if (this.clues) {
          // Reset only selection index
          this.onSelectionChange({ groupIndex: this.selection.groupIndex, itemIndex: -1 });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CrosswordCreateDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gamester.set({
          stage: 'born',
          game: result,
          showMistakes: false,
          difficulty: this.difficulty
        });
      }
    });
  }

  onSelectionChange(selection: TabListSelection) {
    if (this.selection.groupIndex === selection.groupIndex &&
      this.clues[selection.groupIndex].selection === selection.itemIndex) {
      // Unselect this item.
      selection.itemIndex = -1;
    }
    this.clues[selection.groupIndex].selection = selection.itemIndex;
    this.selection = selection;
    this.inputState.clear();
  }

  onAction() {
    if (!this.gamester.state.showMistakes) {
      this.gamester.set({ showMistakes: true });
    } else {
      const { stage, game } = this.gamester.state;
      if (game && stage === 'done') {
        this.dialog.open(CrosswordStatsDialogComponent, { data: getStats(game) });
      }
    }
  }

  onSelectionNext() {
    const clues = this.clues;
    if (clues?.length > 0) {
      let { groupIndex, itemIndex } = this.selection;
      if (++itemIndex >= clues[groupIndex].items.length) {
        groupIndex = (groupIndex + 1) % clues.length;
        itemIndex = 0;
      }
      this.onSelectionChange({ groupIndex, itemIndex });
    }
  }

  onSelectionPrev() {
    const clues = this.clues;
    if (clues?.length > 0) {
      let { groupIndex, itemIndex } = this.selection;
      if (--itemIndex < 0) {
        if (--groupIndex < 0) {
          groupIndex = clues.length - 1;
        }
        itemIndex = clues[groupIndex].items.length - 1;
      }
      this.onSelectionChange({ groupIndex, itemIndex });
    }
  }

  onInputEnter(): string {
    const game = this.gamester.state.game;
    const word = this.inputState.value;
    const desk = this.boardComponent;

    if (game && word && desk) {
      const { groupIndex, itemIndex } = this.selection;
      const item = game.getItem(groupIndex, itemIndex);
      if (item) {
        const letters = toLetters(word);
        if (letters.length !== item.letters.length) {
          return `Input is too ${letters.length < item.letters.length ? 'short' : 'long'}!`;
        }

        for (let i = 0; i < letters.length; i++) {
          const cell = item.cells[i];
          const char = letters[i];
          if (cell.isActive) {
            const shouldAssign = !cell.next || cell.next.value !== char;
            if (shouldAssign && !desk.assignTile(cell, char)) {
              return `Could not find a free tile for ${i + 1} letter '${char}'!`;
            }
          } else {
            if (cell.value !== char) {
              return `${i + 1} letter should be '${cell.value}' instead of '${char}'!`;
            }
          }
        }
      }
    }
    return '';
  }

  onInputKeyDown(event: KeyboardEvent): void {
    const code = event.code;

    if (code === 'ArrowDown') {
      this.onSelectionNext();
    } else if (code === 'ArrowUp') {
      this.onSelectionPrev();
    } else if (code === 'Enter') {
      this.inputState.error = this.onInputEnter();
    }
  }
}
