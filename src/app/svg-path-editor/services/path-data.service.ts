/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';

export interface PathDataState {
  data: string;
  prev?: Readonly<PathDataState>;
  next?: Readonly<PathDataState>;
}

export const initialState: Readonly<PathDataState> = {
  data: '',
  prev: null,
  next: null
};

const KEY = '[svg-path-editor.path-data]';

@Injectable()
export class PathDataService extends StateSubject<PathDataState> {

  /** Save delay in milliseconds */
  saveDelay = 30 * 1000;

  get pathData() {
    return this.state.data;
  }

  set pathData(value: string) {
    const state = this.state;
    if (state.data !== value) {
      this._set({ data: value, prev: state, next: null });
    }
  }

  get canUndo(): boolean {
    return !!this.state.prev;
  }

  get canRedo(): boolean {
    return !!this.state.next;
  }

  get hasLink(): boolean {
    return !(!this.state.prev && !this.state.next);
  }

  private _timerId: ReturnType<typeof setTimeout>;

  constructor() {
    super(initialState);

    try {
      const data = localStorage?.getItem(KEY);
      if (data) {
        this._set({ data });
      }
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }

  restoreDefaults() {
    this._set(initialState);
  }

  undo() {
    const state = this.state;
    const prev = state.prev;
    if (prev) {
      this._set({ data: prev.data, prev: prev.prev, next: state });
    }
  }

  redo() {
    const state = this.state;
    const next = state.next;
    if (next) {
      this._set({ data: next.data, prev: state, next: next.next });
    }
  }

  unlink() {
    const state = this.state;
    if (state.next || state.prev) {
      this._set({ data: state.data, prev: null, next: null });
    }
  }

  protected _set(params: Partial<Readonly<PathDataState>>): boolean {
    const ok = super._set(params);
    if (ok) {
      if (!this._timerId) {
        this._timerId = setTimeout(this._save, this.saveDelay);
      }
      // console.log('PATH:' + this.state.data.substring(0, 20) + '...');
    }
    return ok;
  }

  private _save = () => {
    this._timerId = null;
    try {
      localStorage.setItem(KEY, this.state.data);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  };
}
