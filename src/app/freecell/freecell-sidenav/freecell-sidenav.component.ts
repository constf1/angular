import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { FreecellActionService } from '../services/freecell-action.service';

const BP_XS = Breakpoints.XSmall; // (max-width: 599.99px)
const BP_SM = Breakpoints.Small; // (min-width: 600px) and (max-width: 959.99px)
const BP_MD = Breakpoints.Medium; // (min-width: 960px) and (max-width: 1279.99px)
const BP_LG = Breakpoints.Large; // (min-width: 1280px) and (max-width: 1919.99px)
const BP_XL = Breakpoints.XLarge; // (min-width: 1920px)

const CONTENT_WIDTH = {
  BP_XS: 360,
  BP_SM: 480,
  BP_MD: 760, // 640,
  BP_LG: 1080, // 840,
  BP_XL: 1680
} as const;

const CONTENT_HEIGHT = {
  BP_XS: CONTENT_WIDTH.BP_XS * 3 / 4,
  BP_SM: CONTENT_WIDTH.BP_SM * 3 / 4,
  BP_MD: CONTENT_WIDTH.BP_MD * 3 / 4,
  BP_LG: CONTENT_WIDTH.BP_LG * 3 / 4,
  BP_XL: CONTENT_WIDTH.BP_XL * 3 / 4
} as const;

function getStateName(state: BreakpointState): string {
  const name = (
    state.breakpoints[BP_XS] ? 'BP_XS' :
    state.breakpoints[BP_SM] ? 'BP_SM' :
    state.breakpoints[BP_MD] ? 'BP_MD' :
    state.breakpoints[BP_LG] ? 'BP_LG' :
    state.breakpoints[BP_XL] ? 'BP_XL' :
    'BP_XS');
  return name;
}

@Component({
  selector: 'app-freecell-sidenav',
  templateUrl: './freecell-sidenav.component.html',
  styleUrls: ['./freecell-sidenav.component.scss']
})
export class FreecellSidenavComponent {
  readonly BP_XS = BP_XS;
  readonly BP_SM = BP_SM;
  readonly BP_MD = BP_MD;
  readonly BP_LG = BP_LG;
  readonly BP_XL = BP_XL;

  breakpoints$: Observable<BreakpointState>;

  sidenavOpened = false;
  sidenavClosed = true;
  sidenavModeSide = false;

  constructor(breakpointObserver: BreakpointObserver, public actionService: FreecellActionService) {
    this.breakpoints$ = breakpointObserver.observe([BP_XS, BP_SM, BP_MD, BP_LG, BP_XL]);
  }

  isXSmall(state: BreakpointState) {
    return state.breakpoints[Breakpoints.XSmall];
  }

  getSideNavMode(state: BreakpointState): string {
    return state.breakpoints[BP_XS] ? 'over' : 'side';
  }

  getContentWidth(state: BreakpointState): number {
    return CONTENT_WIDTH[getStateName(state)] || CONTENT_WIDTH.BP_XS;
  }

  getContentHeight(state: BreakpointState): number {
    return CONTENT_HEIGHT[getStateName(state)] || CONTENT_HEIGHT.BP_XS;
  }

  getStateName(state: BreakpointState): string {
    return getStateName(state);
  }

  sidenavEvent(message, event) {
    console.log(message, event);
  }
}
