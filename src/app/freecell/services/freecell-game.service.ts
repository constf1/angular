// tslint:disable: variable-name

import { Injectable } from '@angular/core';
import { UnsubscribableStateSubject } from '../../common/unsubscribable-state-subject';
import { FreecellBasisService, initialState as basisState } from './freecell-basis.service';

import { nextPath, IFreecellReplay } from '../freecell-model';
import { getValidPath, playToMark } from '../freecell-play';
import { FreecellGameView } from '../freecell-game';

export const initialState: IFreecellReplay = {
  ...basisState,
  deal: -1,
  mark: 0,
  path: '',
} as const;

@Injectable()
export class FreecellGameService extends UnsubscribableStateSubject<IFreecellReplay> {
  private _game: FreecellGameView = null;

  get deal() {
    return this.state.deal;
  }

  set deal(value: number) {
    if (this.deal !== value) {
      const { path, mark } = initialState;
      this._set({
        deal: value,
        path, mark
      });
    }
  }

  get mark() {
    return this.state.mark;
  }

  set mark(value: number) {
    if (this.mark !== value) {
      this._set({ mark: value });
    }
  }

  get path() {
    return this.state.path;
  }

  set path(value: string) {
    if (this.path !== value) {
      this._set({ path: value });
    }
  }

  get game(): FreecellGameView {
    return this._game || (this._game = playToMark(this.state));
  }

  constructor(basis: FreecellBasisService) {
    super(initialState);
    this._addSubscription(basis.subscribe(state => {
      this._set({ ...state });
    }));
  }

  protected _validate(state: IFreecellReplay) {
    // Path validation:
    const path = getValidPath(state);
    if (state.path !== path) {
      console.warn('Replacing path with:', path);
      state.path = path;
    }

    // Mark validation:
    state.mark = Math.max(0, Math.min(state.path.length / 2, state.mark));

    state = super._validate(state);
    if (state) {
      // Get ready to state update.
      // new state -> new game
      this._game = null;
    }
    return state;
  }

  move(giver: number, taker: number) {
    const state = this.state;
    const path = nextPath(state.path, state.mark, giver, taker);
    const mark = path.length / 2;

    this._set({
      mark,
      path: state.path.startsWith(path) ? state.path : path // keep the longest path
    });
  }

  set(deal: number, path: string, mark: number) {
    const state = this.state;
    if (deal !== state.deal || path !== state.path || mark !== state.mark) {
      this._set({ deal, path, mark });
    }
  }
}
