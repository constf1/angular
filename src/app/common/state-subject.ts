/* eslint-disable no-underscore-dangle */
import { BehaviorSubject, Observable } from 'rxjs';

export class StateSubject<T> {
  private readonly _stateSubject: BehaviorSubject<Readonly<T>>;
  private readonly _stateKeys: Readonly<string[]>;
  private _previousState: Readonly<T> | null = null;

  get isFirstChange(): boolean {
    return !this._previousState;
  }

  get stateChange(): Observable<Readonly<T>>  {
    return this._stateSubject.asObservable();
  }

  get state(): Readonly<T> {
    return this._stateSubject.value;
  }

  get previousState(): Readonly<T> {
    return this._previousState;
  }

  get keys(): Readonly<string[]> {
    return this._stateKeys;
  }

  constructor(initialValue: Readonly<T>) {
    this._stateSubject = new BehaviorSubject(initialValue);
    this._stateKeys = Object.keys(initialValue);
  }

  get<K extends keyof T>(key: K): Readonly<T[K]> {
    return this.state[key];
  }

  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void) {
    return this._stateSubject.subscribe(next, error, complete);
  }

  equials(newState: Readonly<T>): boolean {
    const oldState = this.state;
    for (const key of this.keys) {
      if (newState[key] !== oldState[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Saves the state locally.
   * Saving could fail if the user has disabled storage for the site, or if the quota has been exceeded.
   *
   * @param keyName the name of the key
   */
  saveLocal(keyName: string): boolean {
    try {
      localStorage.setItem(keyName, JSON.stringify(this.state));
      return true;
    } catch (e) {
      console.warn('localStorage error:', e);
      return false;
    }
  }

  /**
   * Load the state from the local storage.
   *
   * @param keyName the name of the key
   * @param defaultState fallback state
   * @returns `true` if state has been changed, `false` otherwise
   */
  loadLocal(keyName: string, defaultState: Readonly<T>): boolean {
    try {
      const text = localStorage?.getItem(keyName);
      if (text) {
        const data = JSON.parse(text);
        if (data) {
          const state = { ...defaultState };
          for (const key of this.keys) {
            if (typeof state[key] === typeof data[key]) {
              state[key] = data[key];
            }
          }
          return this._set(state);
        }
      }
    } catch (e) {
      console.warn('localStorage error:', e);
    }
    return false;
  }

  /**
   * Overwrite this function to validate the new state.
   * Default implementation returns null if states are equial and the unaltered state object otherwise.
   *
   * @param state new state
   */
  protected _validate(state: T): T | null {
    return this.equials(state) ? null : state;
  }

  protected _set(params: Partial<Readonly<T>>): boolean {
    const state = this._validate({ ...this.state, ...params });
    if (state) {
      // console.log('Next State:', state);
      this._previousState = this._stateSubject.value;
      this._stateSubject.next(state);
      return true;
    }
    return false;
  }
}
