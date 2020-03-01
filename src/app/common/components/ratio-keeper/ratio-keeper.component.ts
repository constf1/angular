import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

// Common aspect ratios:
// 4/3             - Traditional TV format in the 20-th century.
// 16/9            - Modern "widescreen" TV format.
// 185/100 = 91/50 - The most common movie format since the 1960s.
// 239/100         - "Widescreen," anamorphic movie format.

@Component({
  selector: 'app-ratio-keeper',
  templateUrl: './ratio-keeper.component.html',
  styleUrls: ['./ratio-keeper.component.scss']
})
export class RatioKeeperComponent implements OnChanges {
  @Input() width = 320;
  @Input() height = 240;
  @Input() ratio = 1; //  the proportion between width and height

  deltaWidth = 0;
  deltaHeight = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const W = +this.width;
    const H = +this.height;
    this.deltaWidth = 0;
    this.deltaHeight = 0;
    if (W > 0 && H > 0) {
      const HR = H * this.ratio;
      if (W > HR) {
        this.deltaWidth = W - HR;
      } else if (W < HR) {
        this.deltaHeight = H - W / this.ratio;
      }
    }
  }
}
