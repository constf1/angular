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
}

export const initialState: Readonly<FreecellSettingsState> = {
  view: FreecellSettingsViewTypes[0],
  aspectRatio: 0.56, // good for iphone 6/7/8; 0.625 for ipad

  sidenavModeSide: true,
  sidenavClosed: true
};

export const minState: Readonly<Partial<FreecellSettingsState>> = {
  aspectRatio: 0.40
};

export const maxState: Readonly<Partial<FreecellSettingsState>> = {
  aspectRatio: 0.70
};

const KEY = '[FreecellSettingsState]';

@Injectable({
  providedIn: 'root'
})
export class FreecellSettingsService extends StateSubject<FreecellSettingsState> {
  get view() {
    return this.value.view;
  }

  set view(value: FreecellSettingsView) {
    if (this.view !== value) {
      this._next({ view: value });
    }
  }

  get aspectRatio() {
    return this.value.aspectRatio;
  }

  set aspectRatio(value: number) {
    const aspectRatio = +value;
    if (aspectRatio !== this.aspectRatio && !isNaN(aspectRatio)) {
      this._next({ aspectRatio });
    }
  }

  get sidenavModeSide() {
    return this.value.sidenavModeSide;
  }

  set sidenavModeSide(value: boolean) {
    this._next({ sidenavModeSide: !!value });
  }

  get sidenavClosed() {
    return this.value.sidenavClosed;
  }

  set sidenavClosed(value: boolean) {
    this._next({ sidenavClosed: !!value });
  }

  constructor() {
    super(initialState);

    const text = localStorage.getItem(KEY);
    if (text) {
      const data = JSON.parse(text);
      if (data) {
        const state = { ...initialState };
        for (const key of Object.keys(state)) {
          if (typeof state[key] === typeof data[key]) {
            state[key] = data[key];
          }
        }
        this._next(state);
      }
    }
  }

  restoreDefaults() {
    this._next(initialState);
  }

  protected _validate(state: FreecellSettingsState) {
    if (FreecellSettingsViewTypes.indexOf(state.view) < 0) {
      state.view = initialState.view;
    }

    state.aspectRatio = Math.max(minState.aspectRatio, Math.min(maxState.aspectRatio, state.aspectRatio));

    let shouldUpdate = state.sidenavModeSide !== this.sidenavModeSide;
    shouldUpdate = shouldUpdate || state.sidenavClosed !== this.sidenavClosed;
    shouldUpdate = shouldUpdate || state.view !== this.view;
    shouldUpdate = shouldUpdate || state.aspectRatio !== this.aspectRatio;

    if (shouldUpdate) {
      localStorage.setItem(KEY, JSON.stringify(state));
      return state;
    }
    return null;
  }
}
