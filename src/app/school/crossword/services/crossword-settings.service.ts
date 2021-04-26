// tslint:disable: variable-name
import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';

export const CrosswordDifficultyNames = ['very easy', 'easy', 'norm', 'hard', 'very hard'] as const;
export type CrosswordDifficulty = typeof CrosswordDifficultyNames[number];

export interface CrosswordSettingsState {
  crosswordDataTreeState: string;
  crosswordDifficulty: number;
  crosswordMaxHeight: number;
  crosswordMaxWidth: number;
  sidenavModeSide: boolean;
  sidenavClosed: boolean;
}

export const minState: Readonly<SubType<CrosswordSettingsState, number>> = {
  crosswordDifficulty: 0,
  crosswordMaxHeight: 32,
  crosswordMaxWidth: 32,
};

export const maxState: Readonly<SubType<CrosswordSettingsState, number>> = {
  crosswordDifficulty: CrosswordDifficultyNames.length - 1,
  crosswordMaxHeight: 64,
  crosswordMaxWidth: 64,
};

function midpoint(a: number, b: number) {
  return Math.round((a + b) / 2);
}

export const initialState: Readonly<CrosswordSettingsState> = {
  crosswordDataTreeState: '',
  crosswordDifficulty: midpoint(minState.crosswordDifficulty, maxState.crosswordDifficulty),
  crosswordMaxHeight: midpoint(minState.crosswordMaxHeight, maxState.crosswordMaxHeight),
  crosswordMaxWidth: midpoint(minState.crosswordMaxWidth, maxState.crosswordMaxWidth),
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
      const value = state[key];
      if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
        state[key] = Math.max(minState[key], Math.min(maxState[key], value));
      } else {
        state[key] = initialState[key];
      }
    }
    return super._validate(state);
  }
}
