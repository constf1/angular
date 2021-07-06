// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';

import { CrosswordGameService } from '../services/crossword-game.service';
import { CrosswordCreateDialogComponent } from '../crossword-create-dialog/crossword-create-dialog.component';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';
import { CrosswordStatsDialogComponent } from '../crossword-stats-dialog/crossword-stats-dialog.component';
import { getStats } from '../crossword-stats';

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss'],
  providers: [CrosswordGameService]
})
export class CrosswordSidenavComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

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

  constructor(
    public gamester: CrosswordGameService,
    public settings: CrosswordSettingsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this._subscription = this.gamester.stateChange.subscribe((state) => {
      if (state.stage === 'born') {
        this.clues = [
          { label: 'Across', items: [...state.game.xClues] },
          { label: 'Down', items: [...state.game.yClues] }
        ];
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
}
