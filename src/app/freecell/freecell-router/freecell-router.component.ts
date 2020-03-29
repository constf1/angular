// tslint:disable: variable-name
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';

import { FreecellGameService } from '../services/freecell-game.service';

@Component({
  selector: 'app-freecell-router',
  templateUrl: './freecell-router.component.html',
  styleUrls: ['./freecell-router.component.scss']
})
export class FreecellRouterComponent extends UnsubscribableComponent implements OnInit {
  @Input()
  debug = false;

  deal: number;
  mark: number;
  path: string;

  private _lock = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _gameService: FreecellGameService) {
    super();
   }

  private _update(params: Params) {
    // Validate params and update the game.
    const path = params.path || '';

    let deal = parseInt(params.deal, 10);
    if (isNaN(deal) || deal < 0) {
      deal = -1;
    }

    let mark = parseInt(params.mark, 10);
    if (isNaN(mark) || mark < 0 || mark + mark > path.length) {
      mark = Math.floor(path.length / 2);
    }
    if (deal !== this.deal || path !== this.path || mark !== this.mark) {
      this.deal = deal;
      this.path = path;
      this.mark = mark;

      this._lock = true;
      Promise
        .resolve()
        .then(() => this._gameService.set({ deal, path, mark }))
        .finally(() => this._lock = false);
    } else {
      this._lock = false;
    }
  }

  ngOnInit(): void {
    // this._update(this._route.snapshot.queryParams);
    // const params = this._route.snapshot.queryParams;
    // console.log('Params:', params);

    this._lock = true; // lock until the first route update
    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      if (!this._lock &&
        (this.deal !== state.deal || this.path !== state.path || this.mark !== state.mark)) {
        this.deal = state.deal;
        this.path = state.path;
        this.mark = state.mark;

        this.updateAddressBar(state.deal, state.path, state.mark);
      }
    }));

    this._addSubscription(this._route.queryParams.subscribe(params => this._update(params)));
  }

  updateAddressBar(deal?: number, path?: string, mark?: number): Promise<boolean> {
    // console.log('navigate:', deal, path, mark);
    // Don't put empty path into the url.
    if (!path) {
      path = undefined;
      mark = undefined;
    } else {
      // Don't put mark into the url if it equals to the path size.
      if (typeof mark === 'number' && mark + mark === path.length) {
        mark = undefined;
      }
    }
    return this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: { deal, path, mark }
    });
  }
}
