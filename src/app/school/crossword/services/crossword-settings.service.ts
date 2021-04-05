// tslint:disable: variable-name
import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';

export interface CrosswordSettingsState {
  crosswordDifficulty: number;
  sidenavModeSide: boolean;
  sidenavClosed: boolean;
}

export const minState: Readonly<SubType<CrosswordSettingsState, number>> = {
  crosswordDifficulty: 1,
};

export const maxState: Readonly<SubType<CrosswordSettingsState, number>> = {
  crosswordDifficulty: 5,
};


export const initialState: Readonly<CrosswordSettingsState> = {
  crosswordDifficulty: Math.round((minState.crosswordDifficulty + maxState.crosswordDifficulty) / 2),
  sidenavModeSide: true,
  sidenavClosed: false,
};

const KEY = '[crossword.settings]';

@Injectable()
export class CrosswordSettingsService extends StateSubject<CrosswordSettingsState> {
  constructor() {
    super(initialState);
    this.loadLocal(KEY, initialState);
  }

  restoreDefaults() {
    this.set(initialState);
  }

  set(params: Partial<Readonly<CrosswordSettingsState>>): boolean {
    const ok = this._set(params);
    if (ok) {
      this.saveLocal(KEY);
    }
    return ok;
  }

  protected _validate(state: CrosswordSettingsState) {
    for (const key of Object.keys(minState)) {
      state[key] = Math.max(minState[key], Math.min(maxState[key], state[key]));
    }
    return super._validate(state);
  }
}
