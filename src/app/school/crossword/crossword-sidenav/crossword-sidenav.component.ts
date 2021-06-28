// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';

import { CrosswordBoard } from '../crossword-board/crossword-board';
import { CrosswordBoardService } from '../crossword-board/crossword-board.service';
import { CrosswordCreateDialogComponent, Game } from '../crossword-create-dialog/crossword-create-dialog.component';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss'],
  providers: [CrosswordBoardService]
})
export class CrosswordSidenavComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  game: Readonly<Game>;
  clues: TabListGroup[];
  selection: TabListSelection = { groupIndex: 0, itemIndex: -1 };

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

  get showMistakes() {
    return this.boardService.state.showMistakes;
  }

  get showMistakesText() {
    const state = this.boardService.state;
    return state.stage !== 'done' ? state.showMistakes ? 'Checking' : 'Check' : 'Done!';
  }

  get showMistakesIcon() {
    const state = this.boardService.state;
    return state.stage !== 'done' ? 'mode' : 'done';
  }

  get showMistakesIconClassName() {
    const state = this.boardService.state;
    return state.stage !== 'done' ? state.showMistakes ? 'disabled-color' : 'mat-accent' : 'mat-warn';
  }

  constructor(
    public boardService: CrosswordBoardService,
    public settings: CrosswordSettingsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this._subscription = this.boardService.stateChange.subscribe((state) => {
      if (state.stage === 'born') {
        // Reset selection
        this.selection = { groupIndex: 0, itemIndex: -1 };
      } else if (state.stage === 'done') {
        // Reset only selection index
        this.selection = { groupIndex: this.selection.groupIndex, itemIndex: -1 };
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
        this.setItems(result);
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
  }

  setItems(value: Readonly<Game>) {
    this.clues = [
      { label: 'Across', items: value.xClues },
      { label: 'Down', items: value.yClues }
    ];
    this.game = value;

    this.boardService.set({
      stage: 'born',
      board: new CrosswordBoard(value),
      showMistakes: false,
      difficulty: this.difficulty
    });
  }
}
