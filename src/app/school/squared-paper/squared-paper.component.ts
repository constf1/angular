import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

export const SQUARE_SIDE = 24;
export const FONT_SIZE = 5 * SQUARE_SIDE / 6;

export interface Path {
  d: string;
  style?: { [klass: string]: any; };
}

@Component({
  selector: 'app-squared-paper',
  templateUrl: './squared-paper.component.html',
  styleUrls: ['./squared-paper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SquaredPaperComponent implements OnInit {
  @Input() rowNum = 41;
  @Input() colNum = 34;
  @Input() paths: Path[] = [
    {
      d: `M${(this.colNum - 4) * SQUARE_SIDE} 0v${this.height}`,
      style: {
        fill: 'none',
        stroke: '#f00',
        strokeWidth: '2px'
      }
    }
  ];

  get width() {
    return this.colNum * SQUARE_SIDE;
  }

  get height() {
    return this.rowNum * SQUARE_SIDE;
  }

  constructor() {
  }

  ngOnInit(): void {
  }
}
