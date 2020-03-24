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
}
