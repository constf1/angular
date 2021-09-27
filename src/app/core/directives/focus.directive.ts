/* eslint-disable no-underscore-dangle */
import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements AfterViewInit {
  constructor(private _ref: ElementRef/*, private _renderer: Renderer2*/) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const elem = this._ref?.nativeElement;
      if (elem) {
        elem.focus();
      }
    });
  }
}
