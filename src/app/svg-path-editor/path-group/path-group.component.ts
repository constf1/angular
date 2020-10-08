import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-path-group',
  templateUrl: './path-group.component.html',
  styleUrls: ['./path-group.component.scss']
})
export class PathGroupComponent implements OnInit {
  @Input() items: string[];
  selectedItems: boolean[] = [];
  selectedCount = 0;
  hideItems = true;

  @Output() selectionChange = new EventEmitter<boolean[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(index: number) {
    this.selectedItems.length = this.items.length;

    if (this.selectedItems[index]) {
      this.selectedItems[index] = false;
      this.selectedCount--;
    } else {
      this.selectedItems[index] = true;
      this.selectedCount++;
    }
    this.selectionChange.emit([...this.selectedItems]);
  }

  setAll(selected: boolean) {
    this.selectedItems.length = this.items.length;

    for (let i = this.items.length; i-- > 0;) {
      this.selectedItems[i] = selected;
    }
    this.selectedCount = selected ? this.items.length : 0;
    this.selectionChange.emit([...this.selectedItems]);
  }

  trackByIndex(index: number): number {
    return index;
  }

}
