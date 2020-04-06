// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { StateSubject } from '../../common/state-subject';

export const FreecellSettingsViewTypes = ['sidenav', 'sandwich'] as const;
export type FreecellSettingsView = typeof FreecellSettingsViewTypes[number];

export interface FreecellSettingsState {
  view: FreecellSettingsView;
  aspectRatio: number;

  sidenavModeSide: boolean;
  sidenavClosed: boolean;

  deckUseSvg: boolean;

  enableSound: boolean;

  enableRipples: boolean;

  assistLevel: number;
}

export const initialState: Readonly<FreecellSettingsState> = {
  view: FreecellSettingsViewTypes[0],
  aspectRatio: 0.56, // good for iphone 6/7/8; 0.625 for ipad

  sidenavModeSide: true,
  sidenavClosed: true,

  deckUseSvg: false,

  enableSound: false,

  enableRipples: true,

  assistLevel: 1000000,
};

type SubType<A, T> = Pick<A, { [K in keyof A]: A[K] extends T ? K : never }[keyof A]>;

export const minState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.40,
  assistLevel: 20000,
};

export const maxState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.70,
  assistLevel: 2000000
};

const KEY = '[FreecellSettingsState]';

@Injectable()
export class FreecellSettingsService extends StateSubject<FreecellSettingsState> {
  constructor() {
    super(initialState);

    const text = localStorage.getItem(KEY);
    if (text) {
      const data = JSON.parse(text);
      if (data) {
        const state = { ...initialState };
        for (const key of this.keys) {
          if (typeof state[key] === typeof data[key]) {
            state[key] = data[key];
          }
        }
        this._set(state);
      }
    }
  }

  restoreDefaults() {
    this.set(initialState);
  }

  protected _validate(state: FreecellSettingsState) {
    if (FreecellSettingsViewTypes.indexOf(state.view) < 0) {
      state.view = initialState.view;
    }

    for (const key of Object.keys(minState)) {
      state[key] = Math.max(minState[key], Math.min(maxState[key], state[key]));
    }
    return super._validate(state);
  }

  set(params: Partial<Readonly<FreecellSettingsState>>): boolean {
    const ok = this._set(params);
    if (ok) {
      localStorage.setItem(KEY, JSON.stringify(this.state));
    }
    return ok;
  }
}
