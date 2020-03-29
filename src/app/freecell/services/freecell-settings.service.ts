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
}

export const initialState: Readonly<FreecellSettingsState> = {
  view: FreecellSettingsViewTypes[0],
  aspectRatio: 0.56, // good for iphone 6/7/8; 0.625 for ipad

  sidenavModeSide: true,
  sidenavClosed: true,

  deckUseSvg: false,

  enableSound: false
};

type SubType<A, T> = Pick<A, { [K in keyof A]: A[K] extends T ? K : never }[keyof A]>;

export const minState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.40
};

export const maxState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.70
};

const KEY = '[FreecellSettingsState]';

@Injectable({
  providedIn: 'root'
})
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
        this.set(state);
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

    state.aspectRatio = Math.max(minState.aspectRatio, Math.min(maxState.aspectRatio, state.aspectRatio));
    return state;
  }

  set(params: Partial<Readonly<FreecellSettingsState>>): boolean {
    const ok = super.set(params);
    if (ok) {
      localStorage.setItem(KEY, JSON.stringify(this.state));
    }
    return ok;
  }
}
