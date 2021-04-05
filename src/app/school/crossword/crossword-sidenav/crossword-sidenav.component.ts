import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';
import { CrosswordCreateDialogComponent } from '../crossword-create-dialog/crossword-create-dialog.component';
import { CWTerm } from '../crossword-game/crossword-game.component';
import { CrosswordSettingsService } from '../services/crossword-settings.service';

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss']
})
export class CrosswordSidenavComponent implements OnInit {
  items: ReadonlyArray<CWTerm>;

  clues: TabListGroup[];
  selection: TabListSelection;
  selectedWordIndex: number;

  get mode() {
    return this.settings.state.sidenavModeSide ? 'side' : 'over';
  }

  get closed() {
    return this.settings.state.sidenavClosed;
  }

  get opened() {
    return !this.settings.state.sidenavClosed;
  }

  constructor(public settings: CrosswordSettingsService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CrosswordCreateDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setItems(result);
      }
    });
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

  setItems(value: ReadonlyArray<CWTerm>) {
    const across = value.filter((it) => !it.vertical).sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
    const down = value.filter((it) => it.vertical).sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
    this.clues = [
      { label: 'Across', items: across.map((it) => it.clue) },
      { label: 'Down', items: down.map((it) => it.clue) }
    ];
    this.items = across.concat(down);
    this._resetSelection();
  }

  private _resetSelection() {
    this.selection = { groupIndex: 0, itemIndex: -1 };
    this.selectedWordIndex = -1;
  }
}
