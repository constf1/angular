// tslint:disable: variable-name
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
import { UnsubscribableComponent } from '../../common/unsubscribable-component';
import { Linkable, connect, append } from '../../common/linkable';

import { FreecellGameService } from '../services/freecell-game.service';
import { FreecellAutoplayService } from '../services/freecell-autoplay.service';
import { FreecellSettingsService } from '../services/freecell-settings.service';
import { FreecellSoundService } from '../services/freecell-sound.service';

import { FreecellGameView } from '../freecell-game';
import { FreecellLayout } from '../freecell-layout';
import { countEqualMoves } from '../freecell-model';
import { playToMark } from '../freecell-play';

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

type CardItem = Item & Linkable<CardItem> & { card: number };

@Component({
  selector: 'app-freecell-deck',
  templateUrl: './freecell-deck.component.html',
  styleUrls: ['./freecell-deck.component.scss']
})
export class FreecellDeckComponent extends UnsubscribableComponent implements OnInit, OnChanges {
  @Input() layout: FreecellLayout;
  @Output() lineChange = new EventEmitter<LineChangeEvent>();
  @ViewChildren('elements') elementList: QueryList<ElementRef<HTMLElement>>;

  items: Item[] = [];
  spots: Item[] = [];
  cards: CardItem[] = [];

  private _spotSelection = -1;
  private _dragger: MyDragger | null = null;
  private _emptySpotCount = 0;

  constructor(
    public settings: FreecellSettingsService,
    public soundService: FreecellSoundService,
    private _renderer: Renderer2,
    private _playService: FreecellAutoplayService,
    private _gameService: FreecellGameService) {
    super();
  }

  ngOnInit() {
    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      if (this.layout) {
        if (state.deal !== this._gameService.previous.deal) {
          this.onDeal();
        } else {
          this.onCardMove();
        }
      }
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('app-freecell.ngOnChanges', changes);
    if (changes.layout && changes.layout.currentValue) {
      this.spots = this.createSpots();
      this.cards = this.createCards();
      this.items = this.spots.concat(this.cards);
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
    this._playService.stop();

    // console.log('Mousedown:', index);
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (!this._dragger) {
      if (index < this.spots.length) {
        this.setSpotSelection(this._spotSelection === index ? -1 : index);
      } else {
        const game = this._gameService.game;

        const cardIndex = index - this.spots.length;
        const tableau = game.asTablaeu(cardIndex);

        this._dragger = new MyDragger(event.screenX, event.screenY, this._renderer);
        this.onDragStart(tableau);
        this._dragger.onDrag = () => this.onDrag(game, tableau);
        this._dragger.onDragEnd = ev => {
          this.onDragEnd(game, tableau);

          if (this._dragger.dragged) {
            const destination = this.findDestination(index, ev.clientX, ev.clientY);
            if (destination >= 0) {
              const srcLine = game.toLine(cardIndex);
              const dstLine =
                destination < this.spots.length
                  ? destination
                  : game.toLine(destination - this.spots.length);
              if (srcLine !== dstLine) {
                // this.setSpotSelection(-1);
                this.lineChange.emit({ source: srcLine, destination: dstLine, tableau });
              }
            }
          } else {
            const srcLine = game.toLine(cardIndex);
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
      // card.ngStyle.zIndex = (card.ngStyle.zIndex % CARD_NUM) + CARD_NUM;
      card.ngStyle.zIndex += CARD_NUM;
      card.ngClass.dragged = true;
    }
  }

  onDrag(game: FreecellGameView, tableau: Readonly<number[]>) {
    for (const index of tableau) {
      const card = this.cards[index];
      card.ngStyle.transform =
        this.getCardTransform(game, game.toLine(index), index)
        + ' '
        + `translate(${this._dragger.deltaX}px, ${this._dragger.deltaY}px)`;
    }
    if (Math.abs(this._dragger.deltaX) > 4 || Math.abs(this._dragger.deltaY) > 4) {
      this._dragger.dragged = true;
    }
  }

  onDragEnd(game: FreecellGameView, tableau: Readonly<number[]>) {
    for (const index of tableau) {
      const card = this.cards[index];
      const lineIndex = game.toLine(index);

      card.ngStyle.zIndex -= CARD_NUM;
      card.ngStyle.transform = this.getCardTransform(game, lineIndex, index);
      delete card.ngClass.dragged;
      setTransition(card.ngClass, 'transition_fast');
    }
  }

  onDeal() {
    this.setSpotSelection(-1);
    const game = this._gameService.game;

    this._emptySpotCount = game.countEmpty();

    for (let i = game.DESK_SIZE; i-- > 0;) {
      for (const cardIndex of game.getLine(i)) {
        this.bringToFront(cardIndex);
      }

      this.updateLine(game, i, 'transition_deal');
    }
    this.updateZIndex();
    this.soundService.play('deal');
  }

  updateZIndex() {
    if (this.cards.length > 1) {
      let zIndex = 1;
      for (let node = this.cards[0].list.head; node; node = node.next) {
        this.cards[node.card].ngStyle.zIndex = zIndex++;
      }
    }
  }

  bringToFront(cardIndex: number) {
    const node = this.cards[cardIndex];
    const list = node.list;
    if (list && list.tail && list.tail !== node) {
      append(list.tail, node);
    }
  }

  onCardMove() {
    this.setSpotSelection(-1);
    const newState = this._gameService.state;
    const oldState = this._gameService.previous;

    const oldPath = oldState.path.substring(0, oldState.mark * 2);
    const newPath = newState.path.substring(0, newState.mark * 2);
    const lineSet = new Set<number>();

    const count = countEqualMoves(oldPath, newPath);
    const cards: number[] = [];
    if (oldState.mark > count) {
      playToMark(oldState, (v, g, t, i) => {
        if (i >= count) {
          lineSet.add(g);
          lineSet.add(t);
          cards.push(v.getCard(t, -1));
        }
      });
      cards.reverse();
    }
    if (newState.mark > count) {
      playToMark(newState, (v, g, t, i) => {
        if (i >= count) {
          lineSet.add(g);
          lineSet.add(t);
          cards.push(v.getCard(t, -1));
        }
      });
    }
    // Updating Z Index.
    for (const card of cards) {
      this.bringToFront(card);
    }
    this.updateZIndex();

    // console.log('Line Set:', lineSet);

    const transition: Transition = lineSet.size > 2 ? 'transition_fast' : 'transition_norm';
    const game = this._gameService.game;
    for (const line of lineSet.keys()) {
      this.updateLine(game, line, transition);
    }
    if (transition === 'transition_fast') {
      this.soundService.play('shuffle');
    } else if (transition === 'transition_norm') {
      this.soundService.play('card');
    }

    const emptyCount = game.countEmpty();
    if (emptyCount > this._emptySpotCount) {
      this._emptySpotCount = emptyCount;
      this.soundService.play('victory');
    }
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

  createCards(): CardItem[] {
    const cards: CardItem[] = [];
    const layout = this.layout;
    if (layout) {
      const width = toPercent(layout.itemWidth, layout.width);
      const height = toPercent(layout.itemHeight, layout.height);

      for (let i = 0; i < CARD_NUM; i++) {
        const item: CardItem = {
          card: i,
          ngStyle: { width, height, zIndex: i },
          ngClass: {
            ['freecell_card']: true,
            ['freecell_' + suitFullNameOf(i)]: true,
            ['freecell_' + rankFullNameOf(i)]: true
          }
        };
        cards.push(item);
      }
      connect(...cards);
    }
    return cards;
  }

  getCardTransform(game: FreecellGameView, lineIndex: number, cardIndex: number) {
    const pos = this.layout.getCardPosition(lineIndex,
      game.toSpot(cardIndex), game.getLine(lineIndex).length);
    return `translate(${toPercent(pos.x, this.layout.itemWidth)}, ${toPercent(pos.y, this.layout.itemHeight)})`;
  }

  updateLine(game: FreecellGameView, index: number, transition: Transition = 'transition_norm') {
    for (const cardIndex of game.getLine(index)) {
      const item = this.cards[cardIndex];
      item.ngStyle.transform = this.getCardTransform(game, index, cardIndex);
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

  activateOnGesture(event: Event) {
    // console.log('Gesture:', event);
    // SoundService is not activated by default to comply with the Chrome autoplay policy.
    if (event.isTrusted) {
      this.soundService.activate();
    }
  }
}
