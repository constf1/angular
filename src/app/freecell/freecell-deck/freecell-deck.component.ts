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
  ViewChild
} from '@angular/core';

import { toPercent, overlapArea } from '../../common/math-utils';
import { suitFullNameOf, CARD_NUM, rankFullNameOf } from '../../common/deck';
import { UnsubscribableComponent } from '../../common/unsubscribable-component';
import { Linkable, connect, append } from '../../common/linkable';
import { DragListener } from '../../common/drag-listener';

import { FreecellGameService } from '../services/freecell-game.service';
import { FreecellAutoplayService } from '../services/freecell-autoplay.service';
import { FreecellSettingsService, InputMode } from '../services/freecell-settings.service';
import { FreecellSoundService } from '../services/freecell-sound.service';

import { Spot, FreecellPlaygroundComponent } from '../freecell-playground/freecell-playground.component';

import { FreecellGameView } from '../freecell-game';
import { FreecellLayout } from '../freecell-layout';
import { countEqualMoves } from '../freecell-model';
import { playToMark } from '../freecell-play';

export interface LineChangeEvent {
  source: number;
  tableau: Readonly<number[]>;
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

function translate(x: number, y: number, units: string = 'px') {
  return `translate(${x}${units}, ${y}${units})`;
}

type CardItem = Spot & Linkable<CardItem> & { card: number };

interface Position {
  x: number;
  y: number;
}

interface DragData {
  game: FreecellGameView;
  tableau: Readonly<number[]>;
  transforms: Readonly<Position[]>;
  dragged?: boolean;
}

@Component({
  selector: 'app-freecell-deck',
  templateUrl: './freecell-deck.component.html',
  styleUrls: ['./freecell-deck.component.scss']
})
export class FreecellDeckComponent extends UnsubscribableComponent implements OnInit {
  private _dragListener = new DragListener<DragData>();
  private _emptySpotCount = 0;
  private _layout: FreecellLayout;

  public get layout(): FreecellLayout {
    return this._layout;
  }
  @Input()
  public set layout(value: FreecellLayout) {
    if (this._layout !== value) {
      this._layout = value;
      if (this.layout) {
        this.cards = this.createCards();
        this.onDeal();
      }
    }
  }

  @Output() lineChange = new EventEmitter<LineChangeEvent>();
  @ViewChildren('cards') cardList: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(FreecellPlaygroundComponent) playground: FreecellPlaygroundComponent;

  cards: CardItem[] = [];
  spotSelection = -1;

  get isTouchDisabled() {
    // tslint:disable-next-line: no-bitwise
    return !(this.settings.state.inputMode & InputMode.Touch);
  }

  get isMouseDisabled() {
    // tslint:disable-next-line: no-bitwise
    return !(this.settings.state.inputMode & InputMode.Mouse);
  }

  constructor(
    public settings: FreecellSettingsService,
    public soundService: FreecellSoundService,
    private _renderer: Renderer2,
    private _playService: FreecellAutoplayService,
    private _gameService: FreecellGameService
    ) {
    super();
  }

  ngOnInit() {
    this._addSubscription(this._gameService.subscribe(state => {
      if (this.layout) {
        if (this._gameService.isFirstChange || state.deal !== this._gameService.previousState?.deal) {
          this.onDeal();
        } else {
          this.onCardMove();
        }
      }
    }));

    this._addSubscription(this._dragListener.dragChange.subscribe(event => {
      switch (event) {
        case 'DragStart':
          this._onDragStart();
          break;
        case 'DragMove':
          this._onDragMove();
          break;
        case 'DragStop':
          this._onDragStop();
          break;
      }
    }));
  }

  trackByIndex(index: number): number {
    return index;
  }

  getTransforms(tableau: Readonly<number[]>): { x: number, y: number }[] {
    const D = 100;
    const transforms: { x: number, y: number }[] = [];

    const elements = this.cardList.toArray();
    const rc0 = elements[tableau[0]].nativeElement.parentElement.getBoundingClientRect();
    const rc1 = elements[tableau[0]].nativeElement.getBoundingClientRect();

    const left = rc1.left - rc0.left;
    const top = rc1.top - rc0.top;
    const dx = 0;
    const dy = rc1.height / 3;

    for (let i = tableau.length; i-- > 0;) {
      const x = Math.round((left + dx * i) * D) / D;
      const y = Math.round((top + dy * i) * D) / D;
      transforms[i] = { x, y };
    }
    return transforms;
  }

  onTouchStart(event: TouchEvent, index: number) {
    if (this.isTouchDisabled) {
      return;
    }
    this._playService.stop();
    // console.log('Touch Start:', index);
    event.preventDefault();

    const game = this._gameService.game;
    const tableau = game.asTablaeu(index);
    const transforms = this.getTransforms(tableau);

    this._dragListener.touchStart(event, { game, tableau, transforms });
  }

  onTouchEnd(event: TouchEvent, index: number) {
    if (this.isTouchDisabled) {
      return;
    }
    // console.log('Touch End:', index);
    event.preventDefault();
    this._dragListener.stop();
  }

  onTouchCancel(event: TouchEvent, index: number) {
    if (this.isTouchDisabled) {
      return;
    }
    // console.log('Touch Cancel:', index);
    event.preventDefault();
    this._dragListener.stop();
  }

  onTouchMove(event: TouchEvent, index: number) {
    if (this.isTouchDisabled) {
      return;
    }
    // console.log('Touch Move:', index);
    // console.table(event.changedTouches);
    // Call preventDefault() to prevent any further handling
    event.preventDefault();
    this._dragListener.touchMove(event);
  }

  onMouseDown(event: MouseEvent, index: number) {
    if (this.isMouseDisabled) {
      return;
    }
    this._playService.stop();

    // console.log('Mousedown:', index);
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();

    const game = this._gameService.game;
    const tableau = game.asTablaeu(index);
    const transforms = this.getTransforms(tableau);

    this._dragListener.mouseStart(event, this._renderer, { game, tableau, transforms });
  }

  private _onDragStart() {
    // this._playService.lock();
    const { tableau, transforms } = this._dragListener.data;

    for (let i = tableau.length; i-- > 0;) {
      const card = this.cards[tableau[i]];
      card.ngStyle.zIndex += CARD_NUM;
      card.ngStyle.transform = translate(transforms[i].x, transforms[i].y);
      card.ngClass.grabbing = true;
      setTransition(card.ngClass);
    }
  }

  private _onDragMove() {
    const { tableau, transforms } = this._dragListener.data;
    const dx = this._dragListener.deltaX;
    const dy = this._dragListener.deltaY;

    for (let i = tableau.length; i-- > 0;) {
      const card = this.cards[tableau[i]];
      card.ngClass.dragging = true;
      card.ngStyle.transform = translate(transforms[i].x + dx, transforms[i].y + dy);
    }
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      this._dragListener.data.dragged = true;
    }
  }

  private _onDragStop() {
    // this._playService.unlock();
    const { game, tableau, dragged } = this._dragListener.data;

    for (const index of tableau) {
      const card = this.cards[index];

      card.ngStyle.zIndex -= CARD_NUM;
      card.ngStyle.transform = this.getCardTransform(game, game.toLine(index), index);
      delete card.ngClass.grabbing;
      delete card.ngClass.dragging;
      setTransition(card.ngClass, 'transition_fast');
    }

    if (dragged) {
      const dstLine = this.getDestination(game, tableau);
      if (dstLine >= 0) {
        const srcLine = game.toLine(tableau[0]);
        if (srcLine !== dstLine) {
          this.lineChange.emit({ source: srcLine, destination: dstLine, tableau });
        }
      }
    } else {
      const srcLine = game.toLine(tableau[0]);
      const dstLine = this.spotSelection >= 0 ? this.spotSelection : undefined;
      this.lineChange.emit({ source: srcLine, destination: dstLine, tableau });
    }
  }

  onDeal() {
    this.spotSelection = -1;
    const game = this._gameService.game;

    this._emptySpotCount = Math.max(game.CELL_NUM, game.countEmpty());

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
    this.spotSelection = -1;
    const newState = this._gameService.state;
    const oldState = this._gameService.previousState || newState;

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

  getDestination(game: FreecellGameView, tableau: Readonly<number[]>): number {
    let sqMax = 0;
    let destination = -1;
    if (tableau.length > 0) {
      if (this.cardList) {
        const cards = this.cardList.toArray();
        const rcSrc = cards[tableau[0]].nativeElement.getBoundingClientRect();
        // Test cards.
        for (let i = cards.length; i-- > 0;) {
          if (tableau.indexOf(i) < 0) {
            const rcDst = cards[i].nativeElement.getBoundingClientRect();
            const sq = overlapArea(rcSrc, rcDst);
            if (sq > sqMax) {
              sqMax = sq;
              destination = game.toLine(i);
            }
          }
        }
        // Test spots.
        if (this.playground?.spotList) {
          const spots = this.playground.spotList.toArray();
          for (let i = spots.length; i-- > 0;) {
            const rcDst = spots[i].nativeElement.getBoundingClientRect();
            const sq = overlapArea(rcSrc, rcDst);
            if (sq > sqMax) {
              sqMax = sq;
              destination = i;
            }
          }
        }
      }
    }
    return destination;
  }

  activateOnGesture(event: Event) {
    // console.log('Gesture:', event);
    // SoundService is not activated by default to comply with the Chrome autoplay policy.
    if (event.isTrusted) {
      this.soundService.activate();
    }
  }
}
