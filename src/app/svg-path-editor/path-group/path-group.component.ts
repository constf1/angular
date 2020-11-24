import { Component, Input, OnInit } from '@angular/core';
import { PathItem } from '../svg-path/svg-path-item';


@Component({
  selector: 'app-path-group',
  templateUrl: './path-group.component.html',
  styleUrls: ['./path-group.component.scss']
})
export class PathGroupComponent implements OnInit {
  @Input() items: PathItem[];

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
