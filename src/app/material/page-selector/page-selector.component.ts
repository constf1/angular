import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class PageSelectorComponent implements OnInit {
  @Input() itemCount = 0;
  @Input() pageSize = 1;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions?: ReadonlyArray<number>;
  @Output() pageChange = new EventEmitter<PageEvent>();

  get pageCount() {
    return this.pageSize > 0 ? Math.ceil(this.itemCount / this.pageSize) : 0;
  }

  constructor() { }

  ngOnInit(): void {
  }

  requestPageChange(pageSize: number, itemIndex: number) {
    const pageIndex = Math.floor(itemIndex / pageSize);
    if (this.pageIndex !== pageIndex || this.pageSize !== pageSize) {
      this.pageChange.emit({ pageIndex, pageSize });
    }
  }
}
