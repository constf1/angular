// tslint:disable: variable-name

import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';

const SAVE_DELAY_MS = 1000;

export interface EditorSettingsState {
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;

  isBackgroundImageHidden: boolean;

  isControlPoints: boolean;
  controlPointsFillColor: string;

  isPathStroke: boolean;
  pathStrokeColor: string;

  isPathFill: boolean;
  pathFillColor: string;

  sidenavModeSide: boolean;
  sidenavClosed: boolean;

  backgroundColor: string;
}

export const initialState: Readonly<EditorSettingsState> = {
  xOffset: 0,
  yOffset: 0,
  width: 1024,
  height: 1024,

  isBackgroundImageHidden: false,

  isControlPoints: true,
  controlPointsFillColor: '#ffff00',

  isPathStroke: true,
  pathStrokeColor: '#ff00ff',

  isPathFill: false,
  pathFillColor: '#04040f',

  sidenavModeSide: false,
  sidenavClosed: true,

  backgroundColor: '#282828',
};

export const minState: Readonly<SubType<EditorSettingsState, number>> = {
  xOffset: Number.MIN_SAFE_INTEGER,
  yOffset: Number.MIN_SAFE_INTEGER,
  width: 0,
  height: 0
};

export const maxState: Readonly<SubType<EditorSettingsState, number>> = {
  xOffset: Number.MAX_SAFE_INTEGER,
  yOffset: Number.MAX_SAFE_INTEGER,
  width: Number.MAX_SAFE_INTEGER,
  height: Number.MAX_SAFE_INTEGER
};

const KEY = '[svg-path-editor.settings]';

@Injectable()
export class EditorSettingsService extends StateSubject<EditorSettingsState> {
  private _timerId: ReturnType<typeof setTimeout>;

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

  protected _validate(state: EditorSettingsState) {
    for (const key of Object.keys(minState)) {
      state[key] = Math.max(minState[key], Math.min(maxState[key], state[key]));
    }
    return super._validate(state);
  }

  set(params: Partial<Readonly<EditorSettingsState>>): boolean {
    const ok = this._set(params);
    if (ok) {
      if (this._timerId) {
        clearTimeout(this._timerId);
      }
      this._timerId = setTimeout(() => {
        this._timerId = null;
        try {
          localStorage.setItem(KEY, JSON.stringify(this.state));
        } catch (e) {
          console.warn('localStorage error:', e);
        }
      }, SAVE_DELAY_MS);
    }
    return ok;
  }
}
