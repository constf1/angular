/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';

import { StateSubject } from '../../common/state-subject';
import { SubType } from '../../common/types';

export const FreecellSettingsViewTypes = ['sidenav', 'sandwich'] as const;
export type FreecellSettingsView = typeof FreecellSettingsViewTypes[number];

export enum InputMode {
  Mouse = 0b001,
  Touch = 0b010,
  Keyboard = 0b100,
  All = 0b111
}

export interface FreecellSettingsState {
  view: FreecellSettingsView;
  aspectRatio: number;

  sandwichOrder: number;

  sidenavModeSide: boolean;
  sidenavClosed: boolean;

  deckUseSvg: boolean;

  enableSound: boolean;
  enableRipples: boolean;
  enableWinAnimation: boolean;
  enableDarkMode: boolean;

  assistLevel: number;

  inputMode: number;
}

export const initialState: Readonly<FreecellSettingsState> = {
  view: FreecellSettingsViewTypes[0],
  aspectRatio: 0.56, // good for iphone 6/7/8; 0.625 for ipad

  sandwichOrder: 0,

  sidenavModeSide: true,
  sidenavClosed: true,

  deckUseSvg: false,

  enableSound: false,
  enableRipples: true,
  enableWinAnimation: true,
  enableDarkMode: false,

  assistLevel: 1000000,

  inputMode: InputMode.All
};

export const minState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.40,
  assistLevel: 20000,
  sandwichOrder: 0,
  inputMode: 1
};

export const maxState: Readonly<SubType<FreecellSettingsState, number>> = {
  aspectRatio: 0.80,
  assistLevel: 2000000,
  sandwichOrder: 5,
  inputMode: InputMode.All
};

const KEY = '[FreecellSettingsState]';

@Injectable()
export class FreecellSettingsService extends StateSubject<FreecellSettingsState> {
  constructor() {
    super(initialState);
    this.loadLocal(KEY, initialState);
  }

  restoreDefaults() {
    this.set(initialState);
  }

  set(params: Partial<Readonly<FreecellSettingsState>>): boolean {
    const ok = this._set(params);
    if (ok) {
      this.saveLocal(KEY);
    }
    return ok;
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
}
