import { Component, OnInit, Input } from '@angular/core';

export const SQUARE_SIDE = 24;
export const FONT_SIZE = 5 * SQUARE_SIDE / 6;

export function transform(x: number, y: number) {
  return `translate(${x * SQUARE_SIDE}px, ${y * SQUARE_SIDE}px)`;
}

export const EMPTY_PATH = 'M0 0z';

@Component({
  selector: 'app-squared-paper',
  templateUrl: './squared-paper.component.html',
  styleUrls: ['./squared-paper.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SquaredPaperComponent implements OnInit {
  @Input() rowNum = 41;
  @Input() colNum = 34;

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
