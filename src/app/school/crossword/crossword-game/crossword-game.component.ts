// tslint:disable: variable-name
import { Component, Input, OnInit } from '@angular/core';
import { TabListGroup, TabListSelection } from 'src/app/core/components/tab-list/tab-list.component';
import { CWItem } from '../crossword-model';

export type CWTerm = (CWItem & { clue: string; });

@Component({
  selector: 'app-crossword-game',
  templateUrl: './crossword-game.component.html',
  styleUrls: ['./crossword-game.component.scss']
})
export class CrosswordGameComponent implements OnInit {
  private _items: ReadonlyArray<CWTerm>;

  clues: TabListGroup[];
  selection: TabListSelection;
  selectedWordIndex: number;

  @Input() set items(value: ReadonlyArray<CWTerm>) {
    // const across = value.filter((it) => !it.vertical).sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
    const across = value.filter((it) => !it.vertical).sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
    const down = value.filter((it) => it.vertical).sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
    this.clues = [
      { label: 'Across', items: across.map((it) => it.clue) },
      { label: 'Down', items: down.map((it) => it.clue) }
    ];
    this._items = across.concat(down);
    this._resetSelection();
  }

  get items() {
    return this._items;
  }

  constructor() {
    this.items = [];
  }

  ngOnInit(): void {
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

  private _resetSelection() {
    this.selection = { groupIndex: 0, itemIndex: -1 };
    this.selectedWordIndex = -1;
  }
}
