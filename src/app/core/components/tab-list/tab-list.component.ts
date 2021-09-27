import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';

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
export class TabListComponent implements OnInit, OnChanges {
  @Input() groups: TabListGroup[] = [];
  @Input() selection: TabListSelection = { groupIndex: 0, itemIndex: -1 };
  @Output() selectionChange = new EventEmitter<TabListSelection>();

  @Input() panelStyle: NgStyle;

  @ViewChildren('item') itemList: QueryList<ElementRef<HTMLElement>>;

  get labels() {
    return this.groups.map((it) => it.label);
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selection = changes.selection;
    if (selection?.currentValue && selection.currentValue !== selection.previousValue) {
      const index = this.selection.itemIndex;
      if (index >= 0) {
        // Give Angular a chance to rebuild the panel and scroll selected item into the view.
        setTimeout(() => this.scrollItemIntoView(index), 100);
      }
    }
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

  scrollItemIntoView(index: number) {
    const elem = this.itemList?.toArray()[index]?.nativeElement;
    if (elem && typeof elem.scrollIntoView === 'function') {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }
}
