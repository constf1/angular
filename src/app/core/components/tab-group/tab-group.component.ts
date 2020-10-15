import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  @Input() items: string[] = [];
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  constructor() { }
}
