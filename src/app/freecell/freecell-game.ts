import { endsWith, reverseCountEquials } from '../common/array-utils';

import { FreecellDesk } from './freecell-desk';
import { FreecellSolver } from './freecell-solver';

// Swaps source and destination in the path
function swap(path: string, source: number, destination: number) {
  const buf: number[] = [];
  for (let i = 0; i < path.length; i++) {
    let x = path.charCodeAt(i);
    if (x === destination) {
      x = source;
    } else if (x === source) {
      x = destination;
    }
    buf.push(x);
  }
  return String.fromCharCode(...buf);
}

export class FreecellGame extends FreecellDesk {
  private readonly lineMap: number[] = [];
  private readonly spotMap: number[] = [];

  constructor(pileNum: number, cellNum: number, baseNum: number) {
    super(pileNum, cellNum, baseNum);
  }

  toLine(cardIndex: number): number {
    return this.lineMap[cardIndex];
  }

  toSpot(cardIndex: number): number {
    return this.spotMap[cardIndex];
  }

  clear() {
    super.clear();
    this.lineMap.length = 0;
    this.spotMap.length = 0;
  }

  addCard(destination: number, card: number) {
    super.addCard(destination, card);
    this.lineMap[card] = destination;
    this.spotMap[card] = this.getLine(destination).length - 1;
  }

  asTablaeu(card: number): number[] {
    let tableau = this.getTableauAt(this.lineMap[card]);
    const i = tableau.indexOf(card);
    if (i < 0) {
      tableau = [card];
    } else if (i > 0) {
      tableau.splice(0, i);
    }
    return tableau;
  }

  getBestPath(tableau: number[], destination: number): string {
    // Validity checks:
    if (tableau.length <= 0) {
      return '';
    }

    const lastCard = tableau[tableau.length - 1];
    const source = this.lineMap[lastCard];
    if (this.getCard(source, -1) !== lastCard) {
      return '';
    }

    // Handle one card tableau.
    if (tableau.length === 1) {
      return this.isMoveValid(source, destination) ? String.fromCharCode(source, destination) : '';
    }

    const solver = new FreecellSolver(this.PILE_NUM, this.CELL_NUM, this.BASE_NUM, this.toArray());
    solver.cardToWatch = lastCard;
    solver.cardFilter = tableau.reduce((obj, key) => { obj[key] = true; return obj; }, {});
    solver.destinationFilter = { [destination]: true };
    if (this.isPile(destination) && this.getLine(destination).length === 0) {
      // any empty pile is good as destination.
      for (let i = this.PILE_START; i < this.PILE_END; i++) {
        if (this.getLine(i).length === 0) {
          solver.destinationFilter[i] = true;
        }
      }
    }
    solver.onMove = (card: number, src: number, dst: number) => {
      if (endsWith(solver.desk[dst], tableau)) {
        solver.stop(true);
      }
    };

    if (solver.solve()) {
      let path = solver.getPath();
      const d = path.charCodeAt(path.length - 1);
      if (d !== destination) {
        console.log('Swapping destinations:', destination, d);
        path = swap(path, destination, d);
      }

      return path;
    }
    return '';
  }

  solveFor(tableau: number[], source: number): string {
    // Validity checks:
    if (this.getLine(source).length <= 0) {
      return '';
    }
    if (tableau.length <= 0) {
      return '';
    }

    const lastCard = tableau[tableau.length - 1];
    if (this.getCard(source, -1) !== lastCard) {
      return '';
      // tableau = this.getTableauAt(source);
    }

    const solver = new FreecellSolver(this.PILE_NUM, this.CELL_NUM, this.BASE_NUM, this.toArray());

    // Handle one card case.
    let bestPath = '';
    let cardCount = 0;

    solver.cardToWatch = this.getCard(source, -1); // last card
    solver.cardFilter = {[solver.cardToWatch]: true};
    solver.onMove = () => {
      if (!bestPath) {
        bestPath = solver.getPath();
        cardCount = 1;
      }
    };
    solver.findMoves();
    if (bestPath) {
      // Go for the base.
      if (this.isBase(bestPath.charCodeAt(1))) {
        return bestPath;
      }
    } else {
      // We cannot move a card. There is nothing to search for.
      return bestPath;
    }

    // Handle a tableau.
    // const tableau = this.getTableauAt(source);
    if (tableau.length > 1) {
      solver.cardFilter = tableau.reduce((obj, key) => { obj[key] = true; return obj; }, {});
      solver.onMove = (card: number, src: number, dst: number) => {
        if (dst !== source) {
          const dstCount = reverseCountEquials(solver.desk[dst], tableau);
          const srcCount = reverseCountEquials(solver.desk[source], tableau, 0, dstCount);

          if (srcCount + dstCount === tableau.length) {
            if (cardCount < dstCount) {
              bestPath = solver.getPath();
              cardCount = dstCount;

              if (cardCount === tableau.length) {
                solver.stop(true);
              }
            }
          }
        }
      };
      solver.solve();
    }

    return bestPath;
  }
}

export type FreecellGameView = Omit<FreecellGame, 'moveCard' | 'deal' | 'addCard' | 'clear' >;
