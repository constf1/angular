import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appGesture]'
})
export class GestureDirective {
  @Output() userGesture = new EventEmitter<KeyboardEvent | MouseEvent | TouchEvent>();

  constructor() { }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  @HostListener('window:click', ['$event'])
  handle(event: KeyboardEvent | MouseEvent | TouchEvent) {
    this.userGesture.emit(event);
  }
}
