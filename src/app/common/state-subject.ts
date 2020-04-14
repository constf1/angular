// tslint:disable: variable-name
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

  /**
   * Overwrite this function to validate the new state.
   * Default implementation returns null if states are equial and the unaltered state object otherwise.
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

  equials(newState: Readonly<T>): boolean {
    const oldState = this.state;
    for (const key of this.keys) {
      if (newState[key] !== oldState[key]) {
        return false;
      }
    }
    return true;
  }
}
