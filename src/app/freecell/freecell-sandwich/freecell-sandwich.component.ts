// tslint:disable: variable-name
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';

// import { FreecellGameService } from '../freecell-game.service';

@Component({
  selector: 'app-freecell-sandwich',
  templateUrl: './freecell-sandwich.component.html',
  styleUrls: ['./freecell-sandwich.component.scss']
})
export class FreecellSandwichComponent extends UnsubscribableComponent implements OnInit {
  @Output() settingsChange = new EventEmitter<void>();

  readonly BP_XS = Breakpoints.XSmall; // (max-width: 599.99px)
  readonly BP_SM = Breakpoints.Small; // (min-width: 600px) and (max-width: 959.99px)

  noLabel = false;

  constructor(/* private _gameService: FreecellGameService, */ breakpointObserver: BreakpointObserver) {
    super();
    this._addSubscription(breakpointObserver.observe([this.BP_XS, this.BP_SM]).subscribe(bp => {
      this.noLabel = bp.breakpoints[this.BP_XS] || bp.breakpoints[this.BP_SM];
    }));
  }

  ngOnInit(): void {
  }
}
