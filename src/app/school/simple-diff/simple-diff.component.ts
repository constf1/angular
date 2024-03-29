import { Component, Input, OnChanges } from '@angular/core';
import { commonPrefix, commonSuffix } from 'src/app/common/string-utils';

@Component({
  selector: 'app-simple-diff',
  templateUrl: './simple-diff.component.html',
  styleUrls: ['./simple-diff.component.scss']
})
export class SimpleDiffComponent implements OnChanges {
  @Input() pastValue: string;
  @Input() nextValue: string;
  @Input() hideChange?: boolean;

  prefix: string;
  suffix: string;
  remove: string;
  insert: string;

  constructor() {
    this.clear();
  }

  clear() {
    this.prefix = this.suffix = this.remove = this.insert = '';
  }

  ngOnChanges(): void {
    this.clear();

    const a = this.pastValue || '';
    const b = this.nextValue || '';
    if (a === b) {
      this.prefix = a;
    } else {
      const prefix = commonPrefix(a, b);
      const start = prefix.length;

      const suffix = commonSuffix(a, b, start);
      const end = suffix.length;

      this.prefix = prefix;
      this.suffix = suffix;
      this.remove = a.substring(start, a.length - end);
      this.insert = b.substring(start, b.length - end)
      // replaces all spaces with their unicode literal
        .replace(/\s+/g, '\u00A0');

      // if (this.insert && /^\s+$/.test(this.insert)) {
      //   // U+23B5 Bottom Square Bracket (⎵)
      //   // this.insert = '↔';
      //   this.insert = '⎵'; // &blank; (␣) or &#9141;
      // }
    }
  }
}
