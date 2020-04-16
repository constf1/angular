import { Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

// tslint:disable: variable-name
type Listener = () => void;

export const DragEvents = ['DragStart', 'DragMove', 'DragStop'] as const;
export type DragEvent = typeof DragEvents[number];

export class DragListener<T> {
  private readonly _listeners: Listener[] = [];
  private readonly _events = new Subject<DragEvent>();
  private _screenX = 0;
  private _screenY = 0;
  private _clientX = 0;
  private _clientY = 0;
  private _deltaX = 0;
  private _deltaY = 0;
  private _touchId = NaN;

  public data?: T;

  public get dragChange() {
    return this._events.asObservable();
  }

  public get screenX() {
    return this._screenX;
  }
  public get screenY() {
    return this._screenY;
  }
  public get clientX() {
    return this._clientX;
  }
  public get clientY() {
    return this._clientY;
  }
  public get deltaX() {
    return this._deltaX;
  }
  public get deltaY() {
    return this._deltaY;
  }

  public get isTouchDragging() {
    return !isNaN(this._touchId);
  }

  public get isMouseDragging() {
    return this._listeners.length > 0;
  }

  public get isDragging() {
    return this.isTouchDragging || this.isMouseDragging;
  }

  touchStart(event: TouchEvent, data?: T) {
    this.stop();
    this._deltaX = this._deltaY = 0;

    const touches = event.targetTouches;
    if (touches.length > 0) {
      const touch = touches[0];

      this._touchId = touch.identifier;

      this._clientX = touch.clientX;
      this._clientY = touch.clientY;
      this._screenX = touch.screenX;
      this._screenY = touch.screenY;
      this.data = data;
      this._events.next('DragStart');
    }
  }

  touchMove(event: TouchEvent) {
    const touches = event.targetTouches;
    for (let i = touches.length; i-- > 0;) {
      const touch = touches[i];
      if (touch.identifier === this._touchId) {
        this._deltaX = touch.screenX - this._screenX;
        this._deltaY = touch.screenY - this._screenY;
        this._events.next('DragMove');
        break;
      }
    }
  }

  mouseStart(event: MouseEvent, renderer: Renderer2, data?: T) {
    this.stop();

    this._deltaX = this._deltaY = 0;
    this._clientX = event.clientX;
    this._clientY = event.clientY;
    this._screenX = event.screenX;
    this._screenY = event.screenY;
    this.data = data;

    this._listeners.push(renderer.listen('document', 'mousemove', (ev) => {
      ev.preventDefault();

      // Calculate the new cursor position:
      this._deltaX = ev.screenX - this._screenX;
      this._deltaY = ev.screenY - this._screenY;
      const devicePixelRatio = window.devicePixelRatio;
      if (devicePixelRatio && devicePixelRatio !== 1) {
        this._deltaX /= devicePixelRatio;
        this._deltaY /= devicePixelRatio;
      }
      this._events.next('DragMove');
    }));

    // Stop moving when mouse button is released:
    this._listeners.push(renderer.listen('document', 'mouseup', (ev) => {
      this.stop();
    }));

    this._events.next('DragStart');
  }

  stop() {
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
}
