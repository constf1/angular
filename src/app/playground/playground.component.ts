import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FreecellLayout } from '../freecell-layout';
import { toPercent } from '../common/math-utils';

interface Place {
  style: { top: string, left: string, width: string, height: string };
  classNames: { [key: string]: boolean };
}

function createFreecellPlaceholders(layout: FreecellLayout): Place[] {
  const basis = layout.basis;
  const W = layout.width;
  const H = layout.height;

  const width = toPercent(layout.itemWidth, W);
  const height = toPercent(layout.itemHeight, H);

  const placeholders: Place[] = [];
  for (let i = 0; i < basis.DESK_SIZE; i++) {
    const left = toPercent(layout.getX(i), W);
    const top = toPercent(layout.getY(i), H);

    const place: Place = {
      style: { left, top, width, height },
      classNames: { placeholder: true }
    };

    if (basis.isBase(i)) {
      place.classNames.base = true;
    } else if (basis.isCell(i)) {
      place.classNames.cell = true;
    } else if (basis.isPile(i)) {
      place.classNames.pile = true;
    }

    placeholders.push(place);
  }
  return placeholders;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, OnChanges {

  @Input()
  layout: FreecellLayout;

  placeholders: Place[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.layout) {
      this.placeholders = this.layout ? createFreecellPlaceholders(this.layout) : [];
    }
  }

}
