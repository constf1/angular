import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Autoplay } from '../../common/autoplay';
import { randomIneger } from '../../common/math-utils';

import { FreecellGame } from '../freecell-game';
import { FreecellLayout } from '../freecell-layout';
import { FreecellHistory, toNumber } from '../freecell-history';
import { FreecellDbService } from '../freecell-db.service';

import { FreecellDeckComponent, LineChangeEvent } from '../freecell-deck/freecell-deck.component';
import { FreecellHistoryItem } from '../freecell-history/freecell-history.component';

@Component({
  selector: 'app-freecell-main',
  templateUrl: './freecell-main.component.html',
  styleUrls: ['./freecell-main.component.scss']
})
export class FreecellMainComponent implements OnInit, OnDestroy {
  @ViewChild('mainRef', {static: true}) mainRef: ElementRef<HTMLElement>;
  @ViewChild(FreecellDeckComponent) freecellComponent: FreecellDeckComponent;

  name = 'History: ';
  width: number;
  height: number;

  game = new FreecellGame(8, 4, 4);
  layout = new FreecellLayout(this.game);
  history = new FreecellHistory();
  nextMove: { source: number, destination: number } = null;

  autoplay = new Autoplay(200);

  showHistory = false;
  historyItems: FreecellHistoryItem[] = [];
  historySelection = -1;

  subscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private db: FreecellDbService) {
    this.game.deal();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.mainRef && this.mainRef.nativeElement) {
      this.width = this.mainRef.nativeElement.clientWidth;
      this.height = this.mainRef.nativeElement.clientHeight;
    }
  }

  ngOnInit() {
    // console.log('OnInit:', this);
    if (this.mainRef && this.mainRef.nativeElement) {
      this.width = this.mainRef.nativeElement.clientWidth;
      this.height = this.mainRef.nativeElement.clientHeight;
    }

    this.subscription = this.route.queryParams.subscribe(params => {
      // console.log('Params:', params);
      const path = params.path || '';

      let deal = +params.deal;
      if (isNaN(deal) || deal < 0) {
        deal = -1;
      }

      let mark = +params.mark;
      if (isNaN(mark) || mark < 0 || mark + mark > path.length) {
        mark = Math.floor(path.length / 2);
      }

      this.update(deal, path, mark);
    });

    // const left = this.layout.baseStartX;
    // const width = this.layout.baseEndX - this.layout.baseStartX;
    // const top = this.layout.baseEndY + 0.25 * this.layout.deltaHeight;
    // const height = this.layout.deltaHeight * 0.5;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  update(deal: number, path: string, mark: number) {
    if (this.history.deal !== deal) {
      if (this.history.deal >= 0 && !this.game.isSolved()) {
        console.log(`Saving game #${this.history.deal} to DB...`);
        this.db.setGame({ deal: this.history.deal, path: this.history.path });
      }
      this.deal(deal);
    }

    if (this.history.path !== path) {
      // 1. Select common subpath.
      this.select(this.history.countEqualMoves(path));
      // 2. Append the rest.
      for (let i = this.history.mark * 2; i + 1 < path.length; i += 2) {
        const source = toNumber(path, i);
        const destination = toNumber(path, i + 1);
        if (this.game.isMoveValid(source, destination)) {
          this.moveCard(source, destination); // append
        } else {
          console.warn('Invalid path:', path.substring(i));
          break;
        }
      }
    }

    this.select(mark);
  }

  select(mark: number) {
    if (this.history.mark !== mark && mark >= 0 && mark <= this.history.size) {
      while (this.history.mark < mark && this.history.canRedo) {
        this.moveCard(this.history.nextSource, this.history.nextDestination); // redo
      }
      while (this.history.mark > mark && this.history.canUndo) {
        this.moveCard(this.history.lastDestination, this.history.lastSource); // undo
      }
    }
  }

  // ngAfterViewInit() {
    // console.log('AfterViewInit:', this);
    // if (this.mainRef) {
      // this.width = this.mainRef.nativeElement.clientWidth;
      // this.height = this.mainRef.nativeElement.clientHeight;
    // }
  // }

  deal(deal: number) {
    this.game.deal(deal);
    this.historyItems.length = 0;
    this.historySelection = -1;
    this.history.deal = deal;
    this.findNextMove();
    if (this.freecellComponent) {
      this.freecellComponent.onDeal();
    }
  }

  onUndo() {
    if (this.history.canUndo) {
      this.navigate(this.history.deal, this.history.path, this.history.mark - 1);
    }
  }

  onRedo() {
    if (this.history.canRedo) {
      this.navigate(this.history.deal, this.history.path, this.history.mark + 1);
    }
  }

  onDeal() {
    const deal = randomIneger(0, 0x80000000, this.history.deal);
    this.navigate(deal);
  }

  onAuto() {
    this.autoplay.play(() => {
      this.onMoveCard(this.nextMove.source, this.nextMove.destination);
      return !!this.nextMove;
    });
  }

  onLineChange(event: LineChangeEvent) {
    // console.log('Line Change Event:', event);
    this.autoplay.stop();

    let path = '';
    if (event.destination === undefined) {
      path = this.game.solveFor(event.source);
    } else {
      path = this.game.getBestPath(event.tableau, event.destination);
    }
    if (path) {
      this.onMoveCard(path.charCodeAt(0), path.charCodeAt(1),
        path.length > 2 || event.destination !== undefined);
      path = path.substring(2);

      if (path) {
        this.autoplay.play(() => {
          this.onMoveCard(path.charCodeAt(0), path.charCodeAt(1), path.length > 2);
          path = path.substring(2);
          return path.length > 0;
        });
      }
    }
  }

  findNextMove() {
    this.nextMove = null;
    this.game.findMoves((source, destination) => {
      if (this.game.isBase(destination)) {
        this.nextMove = { source, destination };
        return true;
      }
      return false;
    });
  }

  updateHistoryComponent(source: number, destination: number) {
    const card = this.game.getCard(destination, -1);
    const count = this.game.countEmpty();

    const item: FreecellHistoryItem = {
      giver: 'none',
      taker: 'none',
      which: card,
      outcome: count
    };

    if (this.game.getLine(destination).length > 1) {
      const prev = this.game.getCard(destination, -2);
      item.taker = prev;
    } else if (this.game.isBase(destination)) {
      item.taker = 'base';
    } else if (this.game.isCell(destination)) {
      item.taker = 'cell';
    } else if (this.game.isPile(destination)) {
      item.taker = 'pile';
    }

    if (this.game.getLine(source).length > 0) {
      const prev = this.game.getCard(source, -1);
      item.giver = prev;
    } else if (this.game.isBase(source)) {
      item.giver = 'base';
    } else if (this.game.isCell(source)) {
      item.giver = 'cell';
    } else if (this.game.isPile(source)) {
      item.giver = 'pile';
    }

    this.historyItems[this.history.size - 1] = item;
    this.historyItems.length = this.history.size;
  }

  moveCard(source: number, destination: number, fast: boolean = false) {
    this.game.moveCard(source, destination);
    if (this.history.onMove(source, destination) === 0) {
      this.updateHistoryComponent(source, destination);
      if (this.game.isSolved()) {
        this.db.setGame({ deal: this.history.deal, path: this.history.path })
          .then(value => console.log('DB Set Success:', value))
          // .then(() => this.db.getGame(this.history.deal))
          // .then(value => console.log('DB Get Success:', value))
          ;
      }
    }
    this.historySelection = this.history.last;
    if (this.freecellComponent) {
      this.freecellComponent.onCardMove(source, destination, fast ? 'transition_fast' : 'transition_norm');
    }
    this.findNextMove();
  }

  onHistorySelectionChange(value: number) {
    this.navigate(this.history.deal, this.history.path, 1 + value);
  }

  navigate(deal?: number, path?: string, mark?: number) {
    // Don't put mark into the url if it equals to the history size.
    if (mark === this.history.size) {
      mark = undefined;
    }
    // Don't put empty path into the url.
    if (!path) {
      path = undefined;
    }
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { deal, path, mark }
    });
  }

  onMoveCard(source: number, destination: number, fast: boolean = false) {
    this.moveCard(source, destination, fast);
    this.navigate(this.history.deal, this.history.path, this.history.mark);
  }
}
