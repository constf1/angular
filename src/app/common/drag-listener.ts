/* eslint-disable no-underscore-dangle */

import { Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

type Listener = () => void;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DragEvents = ['DragStart', 'DragMove', 'DragStop'] as const;
export type DragEvent = typeof DragEvents[number];

export class DragListener<T> {
  data?: T;
  respectDefault?: boolean;

  private readonly _listeners: Listener[] = [];
  private readonly _events = new Subject<DragEvent>();
  private _clientX = 0;
  private _clientY = 0;
  private _pageX = 0;
  private _pageY = 0;
  private _screenX = 0;
  private _screenY = 0;

  private _clientDeltaX = 0;
  private _clientDeltaY = 0;
  private _pageDeltaX = 0;
  private _pageDeltaY = 0;
  private _screenDeltaX = 0;
  private _screenDeltaY = 0;

  private _touchId = NaN;


  get dragChange() {
    return this._events.asObservable();
  }

  get clientX() {
    return this._clientX;
  }
  get clientY() {
    return this._clientY;
  }
  get pageX() {
    return this._pageX;
  }
  get pageY() {
    return this._pageY;
  }
  get screenX() {
    return this._screenX;
  }
  get screenY() {
    return this._screenY;
  }

  get clientDeltaX() {
    return this._clientDeltaX;
  }
  get clientDeltaY() {
    return this._clientDeltaY;
  }
  get pageDeltaX() {
    return this._pageDeltaX;
  }
  get pageDeltaY() {
    return this._pageDeltaY;
  }
  get screenDeltaX() {
    return this._screenDeltaX;
  }
  get screenDeltaY() {
    return this._screenDeltaY;
  }

  get isTouchDragging() {
    return !isNaN(this._touchId);
  }

  get isMouseDragging() {
    return this._listeners.length > 0;
  }

  get isDragging() {
    return this.isTouchDragging || this.isMouseDragging;
  }

  touchStart(event: TouchEvent, data?: T) {
    this.stop();
    this._clientDeltaX = this._clientDeltaY =
      this._pageDeltaX = this._pageDeltaY =
      this._screenDeltaX = this._screenDeltaY = 0;

    this.data = data;

    const touches = event.targetTouches;
    if (touches.length > 0) {
      const touch = touches[0];

      this._touchId = touch.identifier;
      this._beDoneWith(event);
      this._dragStart(touch);
    }
  }

  touchMove(event: TouchEvent) {
    const touches = event.targetTouches;
    for (let i = touches.length; i-- > 0;) {
      const touch = touches[i];
      if (touch.identifier === this._touchId) {
        this._beDoneWith(event);
        this._dragMove(touch);
        break;
      }
    }
  }

  mouseStart(event: MouseEvent, renderer: Renderer2, data?: T) {
    this.stop();

    this._clientDeltaX = this._clientDeltaY =
      this._pageDeltaX = this._pageDeltaY =
      this._screenDeltaX = this._screenDeltaY = 0;

    this.data = data;

    this._listeners.push(renderer.listen('document', 'mousemove', (ev) => {
      this._beDoneWith(ev);
      this._dragMove(ev);
    }));

    // Stop moving when mouse button is released:
    this._listeners.push(renderer.listen('document', 'mouseup', (ev) => {
      this.stop(ev);
    }));

    this._beDoneWith(event);
    this._dragStart(event);
  }

  stop(event?: MouseEvent | TouchEvent) {
    if (event) {
      this._beDoneWith(event);
    }
    // clean up
    if (this.isDragging) {
      for (const listener of this._listeners) {
        listener();
      }
      this._listeners.length = 0;
      this._touchId = NaN;
      this._events.next('DragStop');
    }
  }

  private _dragMove(event: MouseEvent | Touch) {
    this._clientDeltaX = event.clientX - this._clientX;
    this._clientDeltaY = event.clientY - this._clientY;
    this._pageDeltaX = event.pageX - this._pageX;
    this._pageDeltaY = event.pageY - this._pageY;
    this._screenDeltaX = event.screenX - this._screenX;
    this._screenDeltaY = event.screenY - this._screenY;

    this._events.next('DragMove');
  }

  private _dragStart(event: MouseEvent | Touch) {
    this._clientX = event.clientX;
    this._clientY = event.clientY;
    this._pageX = event.pageX;
    this._pageY = event.pageY;
    this._screenX = event.screenX;
    this._screenY = event.screenY;

    this._events.next('DragStart');
  }

  private _beDoneWith(event: MouseEvent | TouchEvent) {
    if (!this.respectDefault) {
      // Try to prevent any further handling.
      event.preventDefault();
    }
  }
}
