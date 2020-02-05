import { Component, OnInit, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { FreecellLayout } from '../freecell-layout';
import { toPercent } from '../common/math-utils';
import { suitFullNameOf, rankFullNameOf, deck, CARD_NUM } from '../common/deck';
import { Dragger } from '../common/dragger';

interface Place {
  style: {
    top: string,
    left: string,
    width: string,
    height: string,
    zIndex?: number,
    transform?: string,
   };
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
      place.classNames[suitFullNameOf(i - basis.BASE_START)] = true;
    } else if (basis.isCell(i)) {
      place.classNames.cell = true;
    } else if (basis.isPile(i)) {
      place.classNames.pile = true;
    }

    placeholders.push(place);
  }
  return placeholders;
}

function createFreecellCards(layout: FreecellLayout): Place[] {
  const basis = layout.basis;
  const W = layout.width;
  const H = layout.height;

  const width = toPercent(layout.itemWidth, W);
  const height = toPercent(layout.itemHeight, H);

  const cards: Place[] = [];
  for (let i = 0; i < basis.CARD_NUM; i++) {
    const left = toPercent(i, basis.CARD_NUM);
    const top = toPercent(0, H);

    const place: Place = {
      style: { left, top, width, height },
      classNames: { card: true, [rankFullNameOf(i)]: true, [suitFullNameOf(i)]: true  }
    };

    cards.push(place);
  }
  return cards;
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
  cards: Place[] = [];

  @Input()
  desk: number[][] = [deck(0)];

  private dragger: Dragger;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.layout) {
      this.placeholders = this.layout ? createFreecellPlaceholders(this.layout) : [];
      this.cards = this.layout ? createFreecellCards(this.layout) : [];
    }

    const W = this.layout.width;
    const H = this.layout.height;
    for (let i = 0; i < this.desk.length; i++) {
      const pile = this.desk[i];
      for (let j = 0; j < pile.length; j++) {
        const cardIndex = pile[j];
        const card = this.cards[cardIndex];
        card.style.left = toPercent(this.layout.getCardX(i, j, pile.length), W);
        card.style.top = toPercent(this.layout.getCardY(i, j, pile.length), H);
        card.style.zIndex = j;
      }
    }
  }

  onMouseDown(event: MouseEvent, cardIndex: number) {
    if (event.button !== 0) {
      return;
    }

    // console.log('Mousedown:', cardIndex);
    event.preventDefault();

    if (this.dragger) {
      return;
    } else {
      const card = this.cards[cardIndex];
      const styleZIndex = card.style.zIndex;

      card.style.zIndex = CARD_NUM;

      this.dragger = new Dragger(event.screenX, event.screenY, this.renderer);

      this.dragger.onDrag = () => {
        card.style.transform = `translate(${this.dragger.deltaX}px, ${this.dragger.deltaY}px)`;
        card.classNames.dragged = true;
      };
      this.dragger.onDragEnd = () => {
        this.dragger = null;

        card.style.zIndex = styleZIndex;
        delete card.style.transform;
        delete card.classNames.dragged;
      };
    }
  }

}
