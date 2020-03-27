// tslint:disable: variable-name
import { BehaviorSubject, Observable } from 'rxjs';

export class StateSubject<T> {
  protected _stateSubject: BehaviorSubject<Readonly<T>>;
  protected _stateKeys: Readonly<string[]>;

  get state(): Observable<Readonly<T>>  {
    return this._stateSubject.asObservable();
  }

  get value(): Readonly<T> {
    return this._stateSubject.value;
  }

  get keys(): Readonly<string[]> {
    return this._stateKeys;
  }

  constructor(initialValue: Readonly<T> | null = null) {
    this._stateSubject = new BehaviorSubject(initialValue);
    this._stateKeys = Object.keys(initialValue);
  }

  // getItem(key: keyof T) {
  //   return this.value[key];
  // }

  /**
   * Overwrite this function to validate the new state. Default implementation just returns the unaltered state object.
   * @param state new state
   */
  protected _validate(state: T): T | null {
    return state;
  }

  protected _next(params: Partial<Readonly<T>>): boolean {
    const state = this._validate({ ...this.value, ...params });
    if (state && !this.equials(state)) {
      this._stateSubject.next(state);
      return true;
    }
    return false;
  }

  equials(newState: Readonly<T>): boolean {
    const oldState = this.value;
    for (const key of this.keys) {
      if (newState[key] !== oldState[key]) {
        return false;
      }
    }
    return true;
  }
}
