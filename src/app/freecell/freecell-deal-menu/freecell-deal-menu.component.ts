// tslint:disable: variable-name
import { Component, OnInit, Input } from '@angular/core';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';
import { randomInteger } from '../../common/math-utils';
import { padLeft } from '../../common/string-utils';

import { FreecellGameService } from '../services/freecell-game.service';

@Component({
  selector: 'app-freecell-deal-menu',
  templateUrl: './freecell-deal-menu.component.html',
  styleUrls: ['./freecell-deal-menu.component.scss']
})
export class FreecellDealMenuComponent extends UnsubscribableComponent implements OnInit {
  readonly minDeal = 0;
  readonly maxDeal = 0x80000000;
  readonly digitCount = this.maxDeal.toString(10).length;

  @Input() listItem = false;

  deal: number;
  dealLabel = '';
  isMenuOpened = false;

  constructor(private _gameService: FreecellGameService) {
    super();
  }

  ngOnInit(): void {
    this._addSubscription(this._gameService.subscribe(state => {
      // console.log('State:', state);
      this.deal = state.deal;
      this.dealLabel = '#' + (this.deal >= 0
        ? padLeft(this.deal.toString(10), this.digitCount, '0')
        : padLeft('', this.digitCount, '#'));
    }));
  }

  setDeal(deal: number) {
    if (deal >= this.minDeal && deal <= this.maxDeal) {
      this._gameService.deal = deal;
    }
  }

  setRandomDeal() {
    this.setDeal(randomInteger(this.minDeal, this.maxDeal, this.deal));
  }

}
