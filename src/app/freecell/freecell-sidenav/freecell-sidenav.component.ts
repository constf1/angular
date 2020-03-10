import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

// export type FreecellSidenavCommand = 'deal' | 'undo' | 'redo' | 'auto';

@Component({
  selector: 'app-freecell-sidenav',
  templateUrl: './freecell-sidenav.component.html',
  styleUrls: ['./freecell-sidenav.component.scss']
})
export class FreecellSidenavComponent {
  // @Output() sidenavCommand = new EventEmitter<FreecellSidenavCommand>();

  matchXSmall$: Observable<BreakpointState>;

  constructor(breakpointObserver: BreakpointObserver) {
    this.matchXSmall$ = breakpointObserver.observe([
      Breakpoints.XSmall,
    ]);

    // this.matchXSmall$.subscribe(result => {
    //   console.log('Mathch:', result.breakpoints);
    // });
  }
}
