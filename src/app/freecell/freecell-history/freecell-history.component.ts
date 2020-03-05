import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { SimpleVirtualListComponent } from 'src/app/common/components/simple-virtual-list/simple-virtual-list.component';

export interface FreecellHistoryItem {
  which?: string;
  whichClass?: string;
  where?: string;
  whereClass?: string;
  outcome?: string;
  outcomeClass?: string;
}

@Component({
  selector: 'app-freecell-history',
  templateUrl: './freecell-history.component.html',
  styleUrls: ['./freecell-history.component.scss']
})
export class FreecellHistoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: FreecellHistoryItem[] = [];
  @Input() selection: number;
  @Output() selectionChange = new EventEmitter<number>();

  @ViewChild(SimpleVirtualListComponent, { static: true }) list: SimpleVirtualListComponent;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selection) {
      setTimeout(() => {
        const item = Math.max(Math.min(this.selection, this.items.length - 1), 0);
        // console.log('Selection Change:', item);
        this.list.scrollToItem(item);
      }, 0);
    }
  }

  ngOnDestroy() {
  }

  setSelection(value: number) {
    if (this.selection !== value && value <= this.items.length && value >= -1) {
      // this.selection = value;
      this.selectionChange.emit(value);
    }
  }
}
