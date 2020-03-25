// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { StateSubject } from '../../common/state-subject';

import { nextPath, IFreecellReplay, IFreecellBasis } from '../freecell-model';
import { FreecellGameView } from '../freecell-game';
import { playForward, FreecellPlayCallback } from '../freecell-play';

export interface FreecellGameState extends IFreecellReplay {
  game: FreecellGameView | null;
  previous: FreecellGameState;
}

export type FreecellReplayState = Pick<FreecellGameState, 'deal' | 'path' | 'mark'>;

const initialState: FreecellGameState = {
  base: 0,
  cell: 0,
  pile: 0,

  deal: -1,
  path: '',
  mark: 0,

  game: null,
  previous: null
};

@Injectable({
  providedIn: 'root'
})
export class FreecellGameService extends StateSubject<FreecellGameState> {
  get basis(): IFreecellBasis {
    const { base, cell, pile }: IFreecellBasis = this.value;
    return { base, cell, pile };
  }

  set basis({ base, cell, pile }: IFreecellBasis) {
    const state = this.value;
    if (base !== state.base || cell !== state.cell || pile !== state.pile) {
      const { path, mark } = initialState;
      this._next({
        base, cell, pile,
        path, mark
      });
    }
  }

  get replay(): FreecellReplayState {
    const { deal, mark, path }: FreecellReplayState = this.value;
    return { deal, mark, path };
  }

  set replay({ deal, mark, path }: FreecellReplayState) {
    if (deal !== this.deal || mark !== this.mark || path !== this.path) {
      this._next({ deal, mark, path });
    }
  }

  get deal() {
    return this.value.deal;
  }

  set deal(value: number) {
    if (this.deal !== value) {
      const { path, mark } = initialState;
      this._next({
        deal: value,
        path, mark
      });
    }
  }

  get mark() {
    return this.value.mark;
  }

  set mark(value: number) {
    if (this.mark !== value) {
      this._next({ mark: value });
    }
  }

  get path() {
    return this.value.path;
  }

  set path(value: string) {
    if (this.path !== value) {
      this._next({ path: value });
    }
  }

  constructor() {
    super(initialState);
  }

  private _next(params: Partial<Readonly<FreecellGameState>>) {
    const state = { ...this.value, ...params };
    if (state.base > 0) {
      // Path validation:
      let validPath = initialState.path;
      const onmove: FreecellPlayCallback = (_v, giver, taker, _i) => {
        validPath = nextPath(validPath, validPath.length / 2, giver, taker);
      };
      const onerror: FreecellPlayCallback = (_v, _g, _t, i) => {
        console.warn('Invalid path:', state.path.substring(i + i));
      };
      playForward(state, onmove, onerror);

      if (state.path !== validPath) {
        console.warn('Replacing path with:', validPath);
        state.path = validPath;
        state.mark = validPath.length / 2;
      }

      // Mark validation:
      state.mark = Math.max(0, Math.min(state.path.length / 2, state.mark));

      state.game = playForward({
        ...state,
        path: state.path.substring(0, state.mark + state.mark)
      });
    } else {
      state.game = initialState.game;
      state.mark = initialState.mark;
      state.path = initialState.path;
    }

    if (state.deal === this.deal) {
      state.previous = this.value;
    } else {
      state.previous = initialState.previous;
    }

    // console.log('Params:', params);
    // console.log('Next state:', state);
    this._stateSubject.next(state);
  }

  move(giver: number, taker: number) {
    const path = nextPath(this.path, this.mark, giver, taker);
    this._next({
      mark: path.length / 2,
      path
    });
  }
}
