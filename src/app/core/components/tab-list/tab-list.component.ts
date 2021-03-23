import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export type TabListGroup = {
  label: string;
  items: string[];
  selection?: number;
};

export type TabListSelection = {
  groupIndex: number;
  itemIndex: number;
};

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.scss']
})
export class TabListComponent implements OnInit {
  @Input() groups: TabListGroup[] = [];
  @Input() selection: TabListSelection = { groupIndex: 0, itemIndex: -1 };
  @Output() selectionChange = new EventEmitter<TabListSelection>();

  get labels() {
    return this.groups.map((it) => it.label);
  }

  constructor() { }

  ngOnInit(): void {
  }

  onGroupChange(groupIndex: number) {
    const sel: TabListSelection = { groupIndex: -1, itemIndex: -1 };

    const group = this.groups[groupIndex];
    if (group) {
      sel.groupIndex = groupIndex;
      if (typeof group.selection === 'number') {
        sel.itemIndex = group.selection;
      }
    }
    this.selectionChange.emit(sel);
  }

  onItemChange(itemIndex: number) {
    const sel: TabListSelection = { groupIndex: this.selection.groupIndex, itemIndex };
    this.selectionChange.emit(sel);
  }
}
