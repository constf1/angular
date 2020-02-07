import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appKeyedElement]'
})
export class KeyedElementDirective {

  @Input('appKeyedElement')
  key: any;

  constructor(private ref: ElementRef<HTMLElement>) { }

  get nativeElement() {
    return this.ref.nativeElement;
  }

}
