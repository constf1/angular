/* eslint-disable no-underscore-dangle */
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCanvasAnimation]'
})
export class CanvasAnimationDirective implements AfterViewInit, OnDestroy, OnChanges {
  @Input() animationCallback?: (time: number, ctx: CanvasRenderingContext2D) => void;
  @Input() pauseAnimation?: boolean;
  frameCallback: FrameRequestCallback;

  private _context2D: CanvasRenderingContext2D;
  private _frameRequestId = 0;

  constructor(private _ref: ElementRef<HTMLCanvasElement>, private _zone: NgZone) { }

  ngAfterViewInit(): void {
    const canvas = this._ref?.nativeElement;
    if (canvas && typeof canvas.getContext === 'function') {
      this._context2D = canvas.getContext('2d');
      this._startAnimation();
    }
  }

  ngOnDestroy(): void {
    this._stopAnimation();
  }

  ngOnChanges(): void {
    if (this.pauseAnimation) {
      this._stopAnimation();
    } else {
      this._startAnimation();
    }
  }

  private _frameCallback: FrameRequestCallback = (time: number) => {
    NgZone.assertNotInAngularZone();
    this._frameRequestId = 0;
    if (!this.pauseAnimation && this.animationCallback) {
      this.animationCallback(time, this._context2D);
      this._requestAnimationFrame();
    }
  };


  private _requestAnimationFrame() {
    this._frameRequestId = requestAnimationFrame(this._frameCallback);
  }

  private _startAnimation() {
    if (this._context2D && !this.pauseAnimation) {
      this._zone.runOutsideAngular(() => {
        if (!this._frameRequestId) {
          this._requestAnimationFrame();
        }
      });
    }
  }

  private _stopAnimation() {
    if (this._frameRequestId) {
      cancelAnimationFrame(this._frameRequestId);
      this._frameRequestId = 0;
    }
  }
}
