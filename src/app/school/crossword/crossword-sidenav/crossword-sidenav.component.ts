import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';
import { CellState } from '../crossword-board/crossword-board.component';
import { CrosswordCreateDialogComponent, Game } from '../crossword-create-dialog/crossword-create-dialog.component';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss']
})
export class CrosswordSidenavComponent implements OnInit {
  game: Readonly<Game>;
  clues: TabListGroup[];
  selection: TabListSelection;

  canCheckCrossword = false;
  showMistakes = false;

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

  constructor(public settings: CrosswordSettingsService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onBoardChange(cells: CellState[]) {
    this.canCheckCrossword = !this.showMistakes && cells.findIndex((cell) => !cell.answer) < 0;
  }

  checkCrossword() {
    if (this.canCheckCrossword) {
      this._resetSelection();
      this.showMistakes = true;
      this.canCheckCrossword = false;
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
    this._resetSelection();
    this.showMistakes = false;
    this.canCheckCrossword = false;
  }

  private _resetSelection() {
    this.selection = { groupIndex: 0, itemIndex: -1 };
  }
}
