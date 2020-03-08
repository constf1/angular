import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CARD_NUM, suitFullNameOf, playNameOf } from '../../common/deck';

export interface FreecellHistoryItem {
  which: number;
  giver: string | number;
  taker: string | number;
  outcome: number;
}

// const INFO_LEVELS = [
//   'mood_bad',
//   'sentiment_very_dissatisfied',
//   'sentiment_dissatisfied',
//   'sentiment_satisfied',
//   'mood',
//   'sentiment_very_satisfied',
// ] as const;

export const OUTCOMES = [
  'danger-critical',
  'danger-extreme',
  'danger-very-high',
  'danger-high',
  'danger-moderate',
  'danger-low',
  'danger-very-low'
] as const;

@Component({
  selector: 'app-freecell-history',
  templateUrl: './freecell-history.component.html',
  styleUrls: ['./freecell-history.component.scss']
})
export class FreecellHistoryComponent implements OnInit {
  @Input() items: FreecellHistoryItem[] = [];
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  readonly cards: { [key: number]: { className: string, cardName: string } } = {};

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < CARD_NUM; i++) {
      this.cards[i] = {
        className: 'history-item-' + suitFullNameOf(i),
        cardName: playNameOf(i)
      };
    }
  }

  setSelection(value: number) {
    if (this.selection !== value && value <= this.items.length && value >= -1) {
      // this.selection = value;
      this.selectionChange.emit(value);
    }
  }

  getOutcomeClass(index: number): string {
    return OUTCOMES[index] || 'danger-very-low';
  }

  getClass(index: string | number): string {
    return typeof index === 'number' ? this.cards[index]?.className : '';
  }

  getName(index: string | number): string {
    return typeof index === 'string' ? index : this.cards[index]?.cardName;
  }
}
