import { Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

export const TAB_SPLITTER = '|';

@Directive({
  selector: '[appTabGroupLabel]'
})
export class TabGroupLabelDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  labels: string[] = [];

  @Input() set items(value: string[] | string) {
    if (typeof value === 'string') {
      this.labels = value.split(TAB_SPLITTER);
    } else {
      this.labels = value;
    }
  }
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  @ContentChild(TabGroupLabelDirective, { static: false }) labelTemplate: TabGroupLabelDirective;

  constructor() { }
}
