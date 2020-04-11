import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appGesture]'
})
export class GestureDirective {
  @Output() userGesture = new EventEmitter<KeyboardEvent | MouseEvent>();

  constructor() { }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  @HostListener('window:click', ['$event'])
  handle(event: KeyboardEvent | MouseEvent) {
    this.userGesture.emit(event);
  }
}
