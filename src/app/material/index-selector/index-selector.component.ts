import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-index-selector',
  templateUrl: './index-selector.component.html',
  styleUrls: ['./index-selector.component.scss']
})
export class IndexSelectorComponent implements OnInit {
  @Input() label = 'Index';
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
