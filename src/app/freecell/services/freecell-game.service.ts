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
  get deal() {
    return this.state.deal;
  }

  set deal(value: number) {
    if (this.deal !== value) {
      const { path, mark } = initialState;
      this.set({
        deal: value,
        path, mark
      });
    }
  }

  constructor() {
    super(initialState);
  }

  protected _validate(state: FreecellGameState) {
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
      state.previous = this.state;
    } else {
      state.previous = initialState.previous;
    }

    return state;
  }

  move(giver: number, taker: number) {
    const state = this.state;
    const path = nextPath(state.path, state.mark, giver, taker);
    this.set({
      mark: path.length / 2,
      path
    });
  }
}
