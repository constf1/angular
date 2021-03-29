import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RANGE_MEDIATOR, RANGE_SEPARATOR, sieveArray } from 'src/app/common/sieve-array';

type PathDataItem = {
  value: string;
  selected?: boolean;
};

const FILE_LOAD_MESSAGE = 'Loading...';
const FILE_LOAD_ERROR_MESSAGE = 'Error reading from file. Verify that the file exists and that you can access it.';
const FILE_EMPTY_MESSAGE = 'Could not find any SVG path data.';

@Component({
  selector: 'app-svg-open-dialog',
  templateUrl: './svg-open-dialog.component.html',
  styleUrls: ['./svg-open-dialog.component.scss']
})
export class SvgOpenDialogComponent implements OnInit {
  pageIndex = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [ 5, 10, 20, 30, 40, 50 ];

  items: PathDataItem[] = [];

  viewBox = '0 0 100 100';

  selectionInput = '';
  selectedPath = '';

  status = FILE_LOAD_MESSAGE;

  @ViewChild('pathRef') selectedPathRef: ElementRef<SVGPathElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: File) {
  }

  ngOnInit(): void {
    const file = this.data;
    const reader = new FileReader();

    reader.onload = (ev: ProgressEvent) => {
      this.status = FILE_EMPTY_MESSAGE;
      if (typeof reader.result === 'string') {
        const text = reader.result;

        const rePath = /\<path([^>]+)/g;
        const reData = /[\s\"\']d=\"([^\"]+)\"/;
        const matchPath = text.match(rePath);
        if (matchPath) {
          const dataSet = new Set<string>();

          for (const path of matchPath) {
            const matchData = path.match(reData);
            if (matchData && matchData[1]) {
              dataSet.add(matchData[1]);
            }
          }

          for (const data of dataSet.values()) {
            this.items.push({ value: data });
          }

          if (this.items.length === 1) {
            this.setSelectionItem(0, true);
          } else if (this.items.length > 1) {
            const index = this.pageSizeOptions.findIndex(value => value >= this.items.length);
            if (index >= 0 && index + 1 < this.pageSizeOptions.length) {
              this.pageSizeOptions = this.pageSizeOptions.slice(0, index + 1);
            }
            const pageSizeIndex = Math.min(1, this.pageSizeOptions.length - 1);
            this.setPage(this.pageSizeOptions[pageSizeIndex], 0);
          }
        }
      }
    };
    reader.onerror = (ev) => {
      this.status = FILE_LOAD_ERROR_MESSAGE;
    };
    reader.readAsText(file);
  }

  adjustViewBox() {
    setTimeout(() => {
      const path = this.selectedPathRef.nativeElement;
      if (path && typeof path.getBBox === 'function') {
        const rc = path.getBBox();
        const pad = 2;
        const xOffset = Math.floor(rc.x) - pad;
        const yOffset = Math.floor(rc.y) - pad;
        const width = Math.ceil(rc.width) + 2 * pad;
        const height = Math.ceil(rc.height) + 2 * pad;
        if (width > 0 && height > 0) {
          this.viewBox = `${xOffset} ${yOffset} ${width} ${height}`;
        }
      }
    }, 1);
  }

  setPage(pageSize: number, pageIndex: number) {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  trackByIndex(index: number): number {
    return index;
  }

  setSelectionInput(value: string) {
    if (this.selectionInput !== value) {
      this.selectionInput = value;
      this.onInputChange();
    }
  }

  getIndex(offset: number) {
    return this.pageSize * this.pageIndex + offset;
  }

  getVisibility(offset: number) {
    const index = this.getIndex(offset);
    return (index >= 0 && index < this.items?.length) ? 'visible' : 'hidden';
  }

  getSelectionItem(offset: number) {
    const index = this.getIndex(offset);
    return this.items[index]?.selected;
  }

  setSelectionItem(offset: number, value: boolean) {
    const index = this.getIndex(offset);
    const item = this.items[index];
    if (item && !item.selected !== !value) {
      item.selected = value;
      this.onSelectionItemChange();
    }
  }

  onSelectionItemChange() {
    const ranges: { first: number, last: number }[] = [];
    let first = 0;
    let last = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].selected) {
        last = i;
      } else {
        if (last >= first) {
          ranges.push({ first, last });
        }
        first = i + 1;
      }
    }
    if (last >= first) {
      ranges.push({ first, last });
    }

    let buf = '';
    for (const range of ranges) {
      buf += RANGE_SEPARATOR + (range.first + 1);
      if (range.last > range.first) {
        const prefix = (range.last === range.first + 1) ? RANGE_SEPARATOR : RANGE_MEDIATOR;
        buf += prefix + (range.last + 1);
      }
    }

    this.selectionInput = buf.substring(RANGE_SEPARATOR.length);
    this.onSelectionChange();
  }

  onSelectionChange() {
    const selection = this.items
      .filter(item => item.selected)
      .map(item => item.value.replace(/NaN/gi, ' 0 '))
      .join('');
    if (selection !== this.selectedPath) {
      this.selectedPath = selection;
      this.adjustViewBox();
    }
  }

  onInputChange() {
    const size = this.items.length;
    const sift = sieveArray(size, this.selectionInput);
    for (let i = 0; i < size; i++) {
      this.items[i].selected = sift[i];
    }

    this.onSelectionChange();
  }
}
