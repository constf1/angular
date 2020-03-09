import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChildren,
  QueryList,
  ElementRef,
  EventEmitter,
  Renderer2,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Dragger } from '../../common/dragger';
import { toPercent } from '../../common/math-utils';
import { suitFullNameOf, CARD_NUM, rankFullNameOf } from '../../common/deck';

import { FreecellGameView } from '../freecell-game';
import { FreecellLayout } from '../freecell-layout';

interface Item {
  ngStyle: { [klass: string]: any };
  ngClass: { [klass: string]: any };
}

export interface LineChangeEvent {
  source: number;
  tableau: number[];
  destination?: number;
}

const Transitions = ['transition_deal', 'transition_norm', 'transition_fast'] as const;
type Transition = typeof Transitions[number];
type TransitionMap = Partial<{ [key in Transition]: boolean }>;

function setTransition(classNames: TransitionMap, transition?: Transition) {
  for (const t of Transitions) {
    classNames[t] = t === transition;
  }
}

class MyDragger extends Dragger {
  dragged = false;
  constructor(screenX: number, screenY: number, renderer: Renderer2) {
    super(screenX, screenY, renderer);
  }
}

@Component({
  selector: 'app-freecell-deck',
  templateUrl: './freecell-deck.component.html',
  styleUrls: ['./freecell-deck.component.scss']
})
export class FreecellDeckComponent implements OnInit, OnChanges {
  @Input() game: FreecellGameView;
  @Input() layout: FreecellLayout;

  @Output() lineChange = new EventEmitter<LineChangeEvent>();

  @ViewChildren('elements') elementList: QueryList<ElementRef<HTMLElement>>;

  items: Item[] = [];
  spots: Item[] = [];
  cards: Item[] = [];

  // tslint:disable-next-line: variable-name
  private _spotSelection = -1;

  // tslint:disable-next-line: variable-name
  private _dragger: MyDragger | null = null;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('app-freecell.ngOnChanges', changes);
    if (changes.layout) {
      this.spots = this.createSpots();
      this.cards = this.createCards();
      this.items = this.spots.concat(this.cards);
    }
    if (changes.game) {
      this.onDeal();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  setSpotSelection(index: number) {
    if (this._spotSelection >= 0) {
      this.spots[this._spotSelection].ngClass.freecell_selection = false;
    }
    this._spotSelection = index;
    if (this._spotSelection >= 0) {
      this.spots[this._spotSelection].ngClass.freecell_selection = true;
    }
  }

  onMouseDown(event: MouseEvent, index: number) {
    // console.log('Mousedown:', index);
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (!this._dragger) {
      if (index < this.spots.length) {
        this.setSpotSelection(this._spotSelection === index ? -1 : index);
      } else {
        const cardIndex = index - this.spots.length;
        const tableau = this.game.asTablaeu(cardIndex);

        this._dragger = new MyDragger(event.screenX, event.screenY, this.renderer);
        this.onDragStart(tableau);
        this._dragger.onDrag = () => this.onDrag(tableau);
        this._dragger.onDragEnd = ev => {
          this.onDragEnd(tableau);

          if (this._dragger.dragged) {
            const destination = this.findDestination(index, ev.clientX, ev.clientY);
            if (destination >= 0) {
              const srcLine = this.game.toLine(cardIndex);
              const dstLine =
                destination < this.spots.length
                  ? destination
                  : this.game.toLine(destination - this.spots.length);
              if (srcLine !== dstLine) {
                // this.setSpotSelection(-1);
                this.lineChange.emit({ source: srcLine, destination: dstLine, tableau });
              }
            }
          } else {
            const srcLine = this.game.toLine(cardIndex);
            const dstLine = this._spotSelection >= 0 ? this._spotSelection : undefined;
            // this.setSpotSelection(-1);
            this.lineChange.emit({ source: srcLine, destination: dstLine, tableau });
          }

          this._dragger = null;
        };
      }
    }
  }

  onDragStart(tableau: Readonly<number[]>) {
    for (const cardIndex of tableau) {
      const card = this.cards[cardIndex];
      card.ngStyle.zIndex = (card.ngStyle.zIndex % CARD_NUM) + CARD_NUM;
      card.ngClass.dragged = true;
    }
  }

  onDrag(tableau: Readonly<number[]>) {
    for (const index of tableau) {
      const card = this.cards[index];
      card.ngStyle.transform =
        this.getCardTransform(this.game.toLine(index), index)
        + ' '
        + `translate(${this._dragger.deltaX}px, ${this._dragger.deltaY}px)`;
    }
    if (Math.abs(this._dragger.deltaX) > 4 || Math.abs(this._dragger.deltaY) > 4) {
      this._dragger.dragged = true;
    }
  }

  onDragEnd(tableau: Readonly<number[]>) {
    for (const index of tableau) {
      const card = this.cards[index];
      const lineIndex = this.game.toLine(index);

      card.ngStyle.zIndex = card.ngStyle.zIndex % CARD_NUM;
      card.ngStyle.transform = this.getCardTransform(lineIndex, index);
      delete card.ngClass.dragged;
      setTransition(card.ngClass, 'transition_fast');
    }
  }

  onDeal() {
    this.setSpotSelection(-1);
    let zIndex = 0;
    for (let i = this.game.DESK_SIZE; i-- > 0;) {
      for (const cardIndex of this.game.getLine(i)) {
        this.cards[cardIndex].ngStyle.zIndex = zIndex++;
      }
      this.updateLine(i, 'transition_deal');
    }
  }

  bringToFront(cardIndex: number) {
    const cards = this.cards;
    const oldZIndex = cards[cardIndex].ngStyle.zIndex;
    for (let i = 0; i < CARD_NUM; i++) {
      if (cards[i].ngStyle.zIndex > oldZIndex) {
        cards[i].ngStyle.zIndex--;
      }
    }
    cards[cardIndex].ngStyle.zIndex = CARD_NUM - 1;
  }

  onCardMove(source: number, destination: number, transition: Transition = 'transition_norm') {
    this.setSpotSelection(-1);
    this.bringToFront(this.game.getCard(destination, -1));
    this.updateLine(source, transition);
    this.updateLine(destination, transition);
  }

  createSpots(): Item[] {
    const placeholders: Item[] = [];
    const layout = this.layout;
    if (layout) {
      const basis = layout.basis;
      const itemWidth = layout.itemWidth;
      const itemHeight = layout.itemHeight;

      const width = toPercent(itemWidth, layout.width);
      const height = toPercent(itemHeight, layout.height);

      for (let i = 0; i < basis.DESK_SIZE; i++) {
        const pos = layout.getSpotPosition(i);
        const transform = `translate(${toPercent(pos.x, itemWidth)}, ${toPercent(pos.y, itemHeight)})`;

        const item: Item = {
          ngStyle: { transform, width, height },
          ngClass: { freecell_spot: true }
        };

        if (basis.isBase(i)) {
          item.ngClass.freecell_base = true;
          item.ngClass['freecell_' + suitFullNameOf(i - basis.BASE_START)] = true;
        } else if (basis.isCell(i)) {
          item.ngClass.freecell_cell = true;
        } else if (basis.isPile(i)) {
          item.ngClass.freecell_pile = true;
        }

        placeholders.push(item);
      }
    }
    return placeholders;
  }

  createCards(): Item[] {
    const cards: Item[] = [];
    const layout = this.layout;
    if (layout) {
      const width = toPercent(layout.itemWidth, layout.width);
      const height = toPercent(layout.itemHeight, layout.height);

      for (let i = 0; i < CARD_NUM; i++) {
        const item: Item = {
          ngStyle: { width, height, zIndex: i },
          ngClass: {
            ['freecell_card']: true,
            ['freecell_' + suitFullNameOf(i)]: true,
            ['freecell_' + rankFullNameOf(i)]: true
          }
        };
        cards.push(item);
      }
    }
    return cards;
  }

  getCardTransform(lineIndex: number, cardIndex: number) {
    const pos = this.layout.getCardPosition(lineIndex,
      this.game.toSpot(cardIndex), this.game.getLine(lineIndex).length);
    return `translate(${toPercent(pos.x, this.layout.itemWidth)}, ${toPercent(pos.y, this.layout.itemHeight)})`;
  }

  updateLine(index: number, transition: Transition = 'transition_norm') {
    for (const cardIndex of this.game.getLine(index)) {
      const item = this.cards[cardIndex];
      item.ngStyle.transform = this.getCardTransform(index, cardIndex);
      setTransition(item.ngClass, transition);
    }
  }

  findDestination(source: number, clientX: number, clientY: number): number {
    if (this.elementList) {
      const children = this.elementList.toArray();
      for (let i = children.length; i-- > 0;) {
        if (i !== source) {
          const rc = children[i].nativeElement.getBoundingClientRect();
          if (
            rc.left <= clientX &&
            clientX <= rc.right &&
            rc.top <= clientY &&
            clientY <= rc.bottom
          ) {
            // console.log("Collision at: " + i);
            return i;
          }
        }
      }
    }
    return -1;
  }
}
