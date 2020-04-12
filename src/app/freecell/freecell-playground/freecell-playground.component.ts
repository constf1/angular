import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';

import { suitFullNameOf } from '../../common/deck';
import { toPercent } from '../../common/math-utils';

import { FreecellLayout } from '../freecell-layout';
import { FreecellSettingsService } from '../services/freecell-settings.service';
import { FreecellActionService } from '../services/freecell-action.service';

export interface Spot {
  ngStyle: { [klass: string]: any };
  ngClass: { [klass: string]: any };
}

function createSpots(layout: FreecellLayout): Spot[] {
  const spots: Spot[] = [];
  if (layout) {
    const basis = layout.basis;
    const itemWidth = layout.itemWidth;
    const itemHeight = layout.itemHeight;

    const width = toPercent(itemWidth, layout.width);
    const height = toPercent(itemHeight, layout.height);

    for (let i = 0; i < basis.DESK_SIZE; i++) {
      const pos = layout.getSpotPosition(i);
      const transform = `translate(${toPercent(pos.x, itemWidth)}, ${toPercent(pos.y, itemHeight)})`;

      const item: Spot = {
        ngStyle: { transform, width, height },
        ngClass: { }
      };

      if (basis.isBase(i)) {
        item.ngClass.freecell_base = true;
        item.ngClass['freecell_' + suitFullNameOf(i - basis.BASE_START)] = true;
      } else if (basis.isCell(i)) {
        item.ngClass.freecell_cell = true;
      } else if (basis.isPile(i)) {
        item.ngClass.freecell_pile = true;
      }

      spots.push(item);
    }
  }
  return spots;
}

@Component({
  selector: 'app-freecell-playground',
  templateUrl: './freecell-playground.component.html',
  styleUrls: ['./freecell-playground.component.scss'],
  encapsulation: ViewEncapsulation.None // add our CSS to the global styles
})
export class FreecellPlaygroundComponent implements OnInit {
  @Input() set layout(value: FreecellLayout) {
    this.spots = createSpots(value);
  }

  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();

  @ViewChildren('spot') spotList: QueryList<ElementRef<HTMLElement>>;

  spots: Spot[] = [];

  constructor(
    public settings: FreecellSettingsService,
    public action: FreecellActionService
  ) { }

  ngOnInit(): void {
  }
}
