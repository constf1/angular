import { Renderer2 } from '@angular/core';

export interface Draggable {
  offset: (dx: number, dy: number) => void;
  restore: () => void;
}

export class Dragger {
  constructor(public screenX: number, public screenY: number, public renderer: Renderer2, public draggable?: Draggable) {
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

      // if (this.draggable) {
      //   this.draggable.offset(this.deltaX, this.deltaY);
      // }
      if (this.onDrag) {
        this.onDrag(event);
      }
    });

    // Stop moving when mouse button is released:
    const onMouseUpListener = this.renderer.listen('document', 'mouseup', (event) => {
      // clean up
      onMouseMoveListener();
      onMouseUpListener();

      // if (this.draggable) {
      //   this.draggable.restore();
      // }
      if (this.onDragEnd) {
        this.onDragEnd(event);
      }
    });
  }

  deltaX = 0;
  deltaY = 0;
  onDrag?: (event: MouseEvent) => void;
  onDragEnd?: (event: MouseEvent) => void;
}
