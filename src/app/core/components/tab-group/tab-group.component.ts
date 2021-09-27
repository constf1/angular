import { Component, EventEmitter, Input, Output } from '@angular/core';

export const TAB_SPLITTER = '|';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  @Input() set items(value: string[] | string) {
    if (typeof value === 'string') {
      this.labels = value.split(TAB_SPLITTER);
    } else {
      this.labels = value;
    }
  }
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  labels: string[] = [];

  constructor() { }
}
