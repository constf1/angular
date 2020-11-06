import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-path-item-selector',
  templateUrl: './path-item-selector.component.html',
  styleUrls: ['./path-item-selector.component.scss']
})
export class PathItemSelectorComponent implements OnInit {
  @Input() count = 0;
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  requestSelectionChange(value: number) {
    if (value !== this.selection && value >= 0 && value < this.count) {
      this.selectionChange.emit(value);
    }
  }
}
