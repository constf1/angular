// tslint:disable: variable-name

import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';

const SAVE_DELAY_MS = 1000;

const SAMPLE_PATH_DATA =
'm205 698c-17-194 169-280 169-408s-24-259 127-274s177 84 174 243s218 217 164 452c43 15 31 74 55 97'
+ 's50 71-18 97s-75 47-107 77s-129 64-154-28c-45 7-47-8-95-7s-59 10-108 13c-35 78-151 26-174 13'
+ 's-94-9-124-25s-23-52-12-83s-26-87 30-107s40-29 73-60zm-9 30c-20 39-66 34-76 51s-12 23-4 64'
+ 's-18 40-7 78s104 16 156 50s139 24 141-36s-70-102-90-157s-74-120-120-50zm103-60'
+ 'c-56-80 35-193 26-195s-63 84-59 160s86 96 111 126s59 83-4 85q20 22 31 40a150 100-8 00 217-10'
+ 'c33-30 4-182 71-192c-4-74 116-10 116 7s4 21 10 16s12-38-59-66c20-83-54-183-71-182s85 65 51 175'
+ 'q-9-4-22-3c-21-119-82-163-117-316q-12 18-37 30t-30 15q-55 33-90 4t-40-28c-5 121-100 220-104 334'
+ 'zm390 28c-44 17-26 115-47 172s-23 102 16 124s80 6 119-34s68-55 102-69q57-20 4-74'
+ 'c-30-41-15-64-32-82s-28-14-50-12q-88 76-112-25zm9-3c12 73 93 20 85-3s-89-65-85 3m-100-403'
+ 'c-5-29-46-27-77-47s-66-11-84 6s-48 34-48 50s16 25 43 45s41 39 90 11s79-30 76-65zm-14-29'
+ 'a51 65 2 10-86-34l24 9a23 36 0 11 37 17zm-120-34a38 56-1 10-55 38l15-11a16 28-4 11 18-17z'
+ 'm-61 65c81 80 122 15 173-2v5c-52 27-103 80-174 3z';

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

  pathDataInput: string;
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

  pathDataInput: SAMPLE_PATH_DATA
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

const KEY = '[SvgPathEditorSettingsState]';

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
