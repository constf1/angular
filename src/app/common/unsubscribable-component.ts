// tslint:disable: variable-name
import { Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// TODO: Add Angular decorator.
@Inject(UnsubscribableComponent)
export class UnsubscribableComponent implements OnDestroy {
  constructor(protected _subscriptions: Subscription[] = []) { }

  protected _addSubscription(sub: Subscription) {
    this._subscriptions.push(sub);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }
}
