/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { FreecellActionService } from '../services/freecell-action.service';
import { FreecellSettingsService } from '../services/freecell-settings.service';

const BP_XS = Breakpoints.XSmall; // (max-width: 599.99px)
const BP_SM = Breakpoints.Small; // (min-width: 600px) and (max-width: 959.99px)
const BP_MD = Breakpoints.Medium; // (min-width: 960px) and (max-width: 1279.99px)
const BP_LG = Breakpoints.Large; // (min-width: 1280px) and (max-width: 1919.99px)
const BP_XL = Breakpoints.XLarge; // (min-width: 1920px)

@Component({
  selector: 'app-freecell-sidenav',
  templateUrl: './freecell-sidenav.component.html',
  styleUrls: ['./freecell-sidenav.component.scss']
})
export class FreecellSidenavComponent {
  @Output() settingsChange = new EventEmitter<void>();

  readonly BP_XS = BP_XS;
  readonly BP_SM = BP_SM;
  readonly BP_MD = BP_MD;
  readonly BP_LG = BP_LG;
  readonly BP_XL = BP_XL;

  breakpoints$: Observable<BreakpointState>;

  sidenavOpened = false;

  constructor(
    public actionService: FreecellActionService,
    public settings: FreecellSettingsService,
    breakpointObserver: BreakpointObserver) {
    this.breakpoints$ = breakpointObserver.observe([BP_XS, BP_SM, BP_MD, BP_LG, BP_XL]);
  }

  isXSmall(state: BreakpointState) {
    return state.breakpoints[Breakpoints.XSmall];
  }

  getSideNavMode(state: BreakpointState): string {
    return state.breakpoints[BP_XS] ? 'over' : 'side';
  }
}
