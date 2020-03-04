import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
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
