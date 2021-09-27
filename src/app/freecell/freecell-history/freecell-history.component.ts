/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { Component, OnInit } from '@angular/core';

import { CARD_NUM, suitFullNameOf, playNameOf } from '../../common/deck';
import { UnsubscribableComponent } from '../../common/unsubscribable-component';

import { FreecellGameService } from '../services/freecell-game.service';
import { playForward, FreecellPlayCallback } from '../freecell-play';
import { FreecellBasis } from '../freecell-basis';

interface HistoryItem {
  card: number;
  giver: number;
  taker: number;
  outcome: number;

  cardName: string;
  cardClass: string;

  takerName: string;
  takerClass: string;

  outcomeName: string;
  outcomeClass: string;
}

function getSpotName(basis: FreecellBasis, index: number) {
  if (basis.isBase(index)) {
    return 'base';
  }
  if (basis.isPile(index)) {
    return 'pile';
  }
  if (basis.isCell(index)) {
    return 'cell';
  }
  return 'unknown index:' + index;
}

// const INFO_LEVELS = [
//   'mood_bad',
//   'sentiment_very_dissatisfied',
//   'sentiment_dissatisfied',
//   'sentiment_satisfied',
//   'mood',
//   'sentiment_very_satisfied',
// ] as const;

const WIN_MESSAGE = 'solved!';

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
export class FreecellHistoryComponent extends UnsubscribableComponent implements OnInit {
  items: HistoryItem[] = [];
  selection = -1;
  isSolved = false;

  readonly cards: { [key: number]: { className: string; cardName: string } } = {};

  constructor(private _gameService: FreecellGameService) {
    super();
  }

  ngOnInit() {
    for (let i = 0; i < CARD_NUM; i++) {
      this.cards[i] = {
        className: 'history-item-' + suitFullNameOf(i),
        cardName: playNameOf(i)
      };
    }

    this._addSubscription(this._gameService.subscribe(state => {
      if (this._gameService.isFirstChange || state.deal !== this._gameService.previousState?.deal) {
        this.isSolved = false;
        this.items.length = 0;
      }
      if (state.path) {
        this.isSolved = false;
        playForward(state, this.onMoveCallback);
        this.items.splice(state.path.length / 2);
      }
      this.selection = state.mark - 1;
      // this.isSolved = !!this.items.find(item => item.outcomeName === WIN_MESSAGE);
    }));
  }

  onMoveCallback: FreecellPlayCallback = (view, giver, taker, index) => {
    const item: Partial<HistoryItem> = this.items[index] || {};
    if (giver !== item.giver || taker !== item.taker) {
      item.card = view.getCard(taker, -1);
      item.giver = giver;
      item.taker = taker;
      item.outcome = view.countEmpty();

      // item.giverName = view.getLine(giver).length > 0
      //   ? this.cards[view.getCard(giver, -1)].cardName
      //   : getSpotName(view, giver);
      item.cardName = this.cards[item.card].cardName;
      item.cardClass = this.cards[item.card].className;

      if (item.outcome === view.PILE_NUM + view.CELL_NUM) {
        this.isSolved = true;
        item.outcomeName = WIN_MESSAGE;
      } else {
        item.outcomeName = 'free ' + item.outcome;
      }
      item.outcomeClass = OUTCOMES[Math.min(item.outcome, OUTCOMES.length - 1)];

      if (view.getLine(taker).length > 1) {
        const card = view.getCard(taker, -2);
        item.takerName = this.cards[card].cardName;
        item.takerClass = this.cards[card].className;
      } else {
        item.takerName = getSpotName(view, taker);
        item.takerClass = '';
      }

      this.items[index] = item as HistoryItem;
    } else {
      if (item.outcomeName === WIN_MESSAGE) {
        this.isSolved = true;
      }
    }
  };

  setSelection(value: number) {
    if (this.selection !== value && value <= this.items.length && value >= -1) {
      this._gameService.mark = value + 1;
    }
  }
}
