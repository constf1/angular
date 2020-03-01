import { Renderer2 } from '@angular/core';

export class Dragger {
  deltaX = 0;
  deltaY = 0;
  onDrag?: (event: MouseEvent) => void;
  onDragEnd?: (event: MouseEvent) => void;

  constructor(public screenX: number, public screenY: number, public renderer: Renderer2) {
    // Call a function whenever the cursor moves:
    const onMouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => {
      event.preventDefault();

      // Calculate the new cursor position:
      this.deltaX = event.screenX - screenX;
      this.deltaY = event.screenY - screenY;
      if (window.devicePixelRatio) {
        this.deltaX /= window.devicePixelRatio;
        this.deltaY /= window.devicePixelRatio;
      }

      if (this.onDrag) {
        this.onDrag(event);
      }
    });

    // Stop moving when mouse button is released:
    const onMouseUpListener = this.renderer.listen('document', 'mouseup', (event) => {
      // clean up
      onMouseMoveListener();
      onMouseUpListener();

      if (this.onDragEnd) {
        this.onDragEnd(event);
      }
    });
  }
}
