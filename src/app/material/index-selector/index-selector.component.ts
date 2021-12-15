import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-index-selector',
  templateUrl: './index-selector.component.html',
  styleUrls: ['./index-selector.component.scss']
})
export class IndexSelectorComponent {
  /** The value to be used for display purposes. */
  @Input() label = 'Index';
  /** The minimum value that the selector can have. */
  @Input() min = 0;
  /** The maximum value that the selector can have. */
  @Input() max = -1;

  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  /** Whether the component is disabled. */
  get disabled(): boolean {
    return this.max < this.min;
  }

  requestSelectionChange(value: number) {
    if (value !== this.selection && value >= this.min && value <= this.max) {
      this.selectionChange.emit(value);
    }
  }
}
