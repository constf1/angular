import { Component, Input, OnInit } from '@angular/core';
import { PathNode } from '../path-model';

@Component({
  selector: 'app-path-group',
  templateUrl: './path-group.component.html',
  styleUrls: ['./path-group.component.scss']
})
export class PathGroupComponent implements OnInit {
  @Input() items: PathNode[];

  get selectedCount() {
    let count = 0;
    for (const node of this.items) {
      if (node.isSelected) {
        count++;
      }
    }
    return count;
  }

  hideItems = true;

  // @Output() selectionChange = new EventEmitter<boolean[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(index: number) {
    const node = this.items[index];
    if (node) {
      node.isSelected = !node.isSelected;
    }
  }

  setAll(selected: boolean) {
    for (const node of this.items) {
      node.isSelected = selected;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
