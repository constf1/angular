// tslint:disable: variable-name

import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix
//
// | R_ |     | r1 r2 r3 r4 r5 |   | R |
// | G_ |     | g1 g2 g3 g4 g5 |   | G |
// | B_ |  =  | b1 b2 b3 b4 b5 | * | B |
// | A_ |     | a1 a2 a3 a4 a5 |   | A |
// | 1  |     | 0  0  0  0  1  |   | 1 |
//
// R_ = r1*R + r2*G + r3*B + r4*A + r5
// G_ = g1*R + g2*G + g3*B + g4*A + g5
// B_ = b1*R + b2*G + b3*B + b4*A + b5
// A_ = a1*R + a2*G + a3*B + a4*A + a5

export const FE_COLOR_MATRICES = {
  identity: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0',
  invert: '-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0',
  blue: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0',
  gray: '0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 1 0',
  green: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0',
  magenta: '1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0',
  red: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',
  yellow: '1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0',
  darken: '.5 0 0 0 0 0 .5 0 0 0 0 0 .5 0 0 0 0 0 1 0',
  lighten: '1.5 0 0 0 0 0 1.5 0 0 0 0 0 1.5 0 0 0 0 0 1 0',
  // red: '1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',
  // green: '0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1 0',
  // blue: '0 0 0 0 0 0 0 0 0 0 1 1 1 1 0 0 0 0 1 0',
} as const;

export type FeColorMatrixName = keyof typeof FE_COLOR_MATRICES;

export const DECIMAL_FORMAT_LABELS = ['to integer', '#.#', '#.##', '#.###', '%.4f', '%.5f', '%.6f'] as const;

const SAVE_DELAY_MS = 1000;

export interface EditorSettingsState {
  viewBoxPadding: number;
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;
  zoom: number;
  backgroundImageZoom: number;
  backgroundImageColorMatrixName: FeColorMatrixName;

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

  maximumFractionDigits: number;
}

export const initialState: Readonly<EditorSettingsState> = {
  viewBoxPadding: 1,
  xOffset: 0,
  yOffset: 0,
  width: 1024,
  height: 1024,
  zoom: 100,
  backgroundImageZoom: 100,
  backgroundImageColorMatrixName: 'identity',

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

  maximumFractionDigits: 2,
};

export const minState: Readonly<SubType<EditorSettingsState, number>> = {
  viewBoxPadding: 0,
  xOffset: Number.MIN_SAFE_INTEGER,
  yOffset: Number.MIN_SAFE_INTEGER,
  width: 1,
  height: 1,
  zoom: 25,
  backgroundImageZoom: 1,
  maximumFractionDigits: 0,
};

export const maxState: Readonly<SubType<EditorSettingsState, number>> = {
  viewBoxPadding: Number.MAX_SAFE_INTEGER,
  xOffset: Number.MAX_SAFE_INTEGER,
  yOffset: Number.MAX_SAFE_INTEGER,
  width: Number.MAX_SAFE_INTEGER,
  height: Number.MAX_SAFE_INTEGER,
  zoom: 400,
  backgroundImageZoom: 10000,
  maximumFractionDigits: DECIMAL_FORMAT_LABELS.length - 1,
};

const KEY = '[svg-path-editor.settings]';

@Injectable()
export class EditorSettingsService extends StateSubject<EditorSettingsState> {
  private _timerId: ReturnType<typeof setTimeout>;

  get imageColorMatrix() {
    return FE_COLOR_MATRICES[this.state.backgroundImageColorMatrixName] || FE_COLOR_MATRICES.identity;
  }

  constructor() {
    super(initialState);
    this.loadLocal(KEY, initialState);
  }

  restoreDefaults() {
    this.set(initialState);
  }

  protected _validate(state: EditorSettingsState) {
    for (const key of Object.keys(minState)) {
      state[key] = Math.max(minState[key], Math.min(maxState[key], state[key] || 0));
    }

    if (!(state.backgroundImageColorMatrixName in FE_COLOR_MATRICES)) {
      state.backgroundImageColorMatrixName = 'identity';
    }

    // TODO: Validate color strings.
    // The format is "#rrggbb" where rr, gg, bb are two-digit hexadecimal numbers.
    // console.log('STATE:', state);

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
        this.saveLocal(KEY);
      }, SAVE_DELAY_MS);
    }
    return ok;
  }
}
