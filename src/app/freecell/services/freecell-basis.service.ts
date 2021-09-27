/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';

import { StateSubject } from '../../common/state-subject';
import { IFreecellBasis } from '../freecell-model';
import { FreecellBasis } from '../freecell-basis';

// Standard freecell basis.
export const initialState: IFreecellBasis = {
  base: 4,
  cell: 4,
  pile: 8
} as const;

@Injectable()
export class FreecellBasisService extends StateSubject<IFreecellBasis> {
  private _basis = new FreecellBasis(initialState.pile, initialState.cell, initialState.base);

  get basis() {
    return this._basis;
  }

  constructor() {
    super(initialState);
  }

  set(basis: Partial<Readonly<IFreecellBasis>>) {
    return this._set(basis);
  }

  protected _validate(state: IFreecellBasis) {
    if (state.base > 0 && state.cell > 0 && state.pile > 0) {
      state = super._validate(state);
      if (state) {
        // set a new basis
        this._basis = new FreecellBasis(state.pile, state.cell, state.base);
        return state;
      }
    }
    return null;
  }
}
