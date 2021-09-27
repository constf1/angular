/* eslint-disable no-underscore-dangle */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';

import { FreecellSettingsService } from '../services/freecell-settings.service';
// import { FreecellGameService } from '../freecell-game.service';

const BP_XS = Breakpoints.XSmall; // (max-width: 599.99px)
const BP_SM = Breakpoints.Small; // (min-width: 600px) and (max-width: 959.99px)
const BP_LG = Breakpoints.Large; // (min-width: 1280px) and (max-width: 1919.99px)
const BP_XL = Breakpoints.XLarge; // (min-width: 1920px)

@Component({
  selector: 'app-freecell-sandwich',
  templateUrl: './freecell-sandwich.component.html',
  styleUrls: ['./freecell-sandwich.component.scss']
})
export class FreecellSandwichComponent extends UnsubscribableComponent implements OnInit {
  @Output() settingsChange = new EventEmitter<void>();

  noLabel = false;
  rowNum = 3;

  constructor(/* private _gameService: FreecellGameService, */
    breakpointObserver: BreakpointObserver,
    public settings: FreecellSettingsService) {
    super();
    this._addSubscription(breakpointObserver.observe([BP_XS, BP_SM, BP_LG, BP_XL]).subscribe(bp => {
      this.noLabel = bp.breakpoints[BP_XS] || bp.breakpoints[BP_SM];
      if (bp.breakpoints[BP_XS]) {
        this.rowNum = 3;
      } else if (bp.breakpoints[BP_LG] || bp.breakpoints[BP_XL]) {
        this.rowNum = 1;
      } else {
        this.rowNum = 2;
      }
    }));
  }

  ngOnInit(): void {
  }
}
