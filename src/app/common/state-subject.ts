// tslint:disable: variable-name
import { BehaviorSubject, Observable } from 'rxjs';

export class StateSubject<T> {
  protected _stateSubject: BehaviorSubject<Readonly<T>>;

  get state(): Observable<Readonly<T>>  {
    return this._stateSubject.asObservable();
  }

  get value(): Readonly<T> {
    return this._stateSubject.value;
  }

  constructor(initialValue: Readonly<T> | null = null) {
    this._stateSubject = new BehaviorSubject(initialValue);
  }

  /**
   * Overwrite this function to validate the new state. Default implementation just returns the unaltered state object.
   * @param state new state
   */
  protected _validate(state: T): T | null {
    return state;
  }

  protected _next(params: Partial<Readonly<T>>): boolean {
    const state = this._validate({ ...this.value, ...params });
    if (state) {
      this._stateSubject.next(state);
    }
    return !!state;
  }
}
