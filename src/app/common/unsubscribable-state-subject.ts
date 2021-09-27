/* eslint-disable no-underscore-dangle */
import { Subscription } from 'rxjs';
import { Inject, OnDestroy } from '@angular/core';
import { StateSubject } from './state-subject';

// TODO: Add Angular decorator.
@Inject(UnsubscribableStateSubject)
export class UnsubscribableStateSubject<T> extends StateSubject<T> implements OnDestroy {
  constructor(initialValue: T | null = null, protected _subscriptions: Subscription[] = []) {
    super(initialValue);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected _addSubscription(sub: Subscription) {
    this._subscriptions.push(sub);
  }
}
