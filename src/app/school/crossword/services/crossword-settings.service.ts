// tslint:disable: variable-name
import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';

export interface CrosswordSettingsState {
  sidenavModeSide: boolean;
  sidenavClosed: boolean;
}

export const initialState: Readonly<CrosswordSettingsState> = {
  sidenavModeSide: true,
  sidenavClosed: false,
};

const KEY = '[crossword.settings]';

@Injectable()
export class CrosswordSettingsService extends StateSubject<CrosswordSettingsState> {
  constructor() {
    super(initialState);
    try {
      const text = localStorage?.getItem(KEY);
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
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }

  restoreDefaults() {
    this.set(initialState);
  }

  set(params: Partial<Readonly<CrosswordSettingsState>>): boolean {
    const ok = this._set(params);
    if (ok) {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('localStorage error:', e);
      }
    }
    return ok;
  }
}
