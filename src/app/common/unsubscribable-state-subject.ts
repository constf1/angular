// tslint:disable: variable-name
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { StateSubject } from './state-subject';

export class UnsubscribableStateSubject<T> extends StateSubject<T> implements OnDestroy {
  constructor(initialValue: T | null = null, protected _subscriptions: Subscription[] = []) {
    super(initialValue);
  }

  protected _addSubscription(sub: Subscription) {
    this._subscriptions.push(sub);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }
}
