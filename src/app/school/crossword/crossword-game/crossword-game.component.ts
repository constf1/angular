// tslint:disable: variable-name
import { Component, Input, OnInit } from '@angular/core';
import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';
import { Game } from '../crossword-create-dialog/crossword-create-dialog.component';

@Component({
  selector: 'app-crossword-game',
  templateUrl: './crossword-game.component.html',
  styleUrls: ['./crossword-game.component.scss']
})
export class CrosswordGameComponent implements OnInit {
  private _game: Readonly<Game>;

  clues: TabListGroup[];
  selection: TabListSelection;

  @Input() set game(value: Readonly<Game>) {
    this.clues = [
      { label: 'Across', items: value.xClues },
      { label: 'Down', items: value.yClues }
    ];
    this._game = value;
    this._resetSelection();
  }

  get items() {
    return this._game;
  }

  constructor() {
  }

  ngOnInit(): void {
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

  private _resetSelection() {
    this.selection = { groupIndex: 0, itemIndex: -1 };
  }
}
