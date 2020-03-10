import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

export type FreecellSidenavCommand = 'deal' | 'undo' | 'redo' | 'auto';

@Component({
  selector: 'app-freecell-sidenav',
  templateUrl: './freecell-sidenav.component.html',
  styleUrls: ['./freecell-sidenav.component.scss']
})
export class FreecellSidenavComponent {
  @Output() sidenavCommand = new EventEmitter<FreecellSidenavCommand>();

  matchXSmall$: Observable<BreakpointState>;

  fillerContent = Array.from({length: 50}, () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  constructor(breakpointObserver: BreakpointObserver) {
    this.matchXSmall$ = breakpointObserver.observe([
      Breakpoints.XSmall,
    ]);
  }
}
