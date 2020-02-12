// tslint:disable: variable-name

import { FreecellBasis, isTableau, Filter, solve, Path, isMoveValid } from './freecell-basis';
import { deck } from './common/deck';

export class FreecellGame {
  private readonly _desk: number[][] = [];
  private readonly _lineMap: number[] = [];
  private readonly _spotMap: number[] = [];

  get length() {
    return this._desk.length;
  }

  get lineMap(): Readonly<number[]> {
    return this._lineMap;
  }

  get spotMap(): Readonly<number[]> {
    return this._spotMap;
  }

  constructor(public readonly basis: FreecellBasis) {
    for (let i = this.basis.DESK_SIZE; i-- > 0;) {
      this._desk.push([]);
    }
  }

  private _addCard(destination: number, card: number) {
    this._lineMap[card] = destination;
    this._spotMap[card] = this._desk[destination].length;
    this._desk[destination].push(card);
  }

  /**
   * Clears the game.
   */
  private _clear() {
    for (let i = this.basis.DESK_SIZE; i-- > 0;) {
      this._desk[i].length = 0;
    }
    this._lineMap.length = 0;
    this._spotMap.length = 0;
  }

  /*
   * Public mutators:
   */

  /**
   * Pops the last card from the `source` line and add it to the `destination`
   * @param source source line
   * @param destination destination line
   */
  moveCard(source: number, destination: number) {
    if (this.isMoveValid(source, destination)) {
      this._addCard(destination, this._desk[source].pop());
      return true;
    }
    return false;
  }

  /**
   * Makes a new deal.
   * @param seed seed number
   */
  deal(seed?: number) {
    this._clear();
    const cards = deck(seed);

    const PILE_START = this.basis.PILE_START;
    const PILE_NUM = this.basis.PILE_NUM;

    for (let i = 0; i < cards.length; i++) {
      this._addCard(PILE_START + (i % PILE_NUM), cards[i]);
    }
    return cards;
  }

  /*
   * Constant getters:
   */
  isMoveValid(source: number, destination: number) {
    return isMoveValid(this.basis, this._desk, source, destination);
  }

  /**
   * Returns a line of cards
   * @param line a line index
   */
  lineAt(line: number): Readonly<number[]> {
    return this._desk[line];
  }

  numberOfCardsAt(line: number) {
    return this._desk[line].length;
  }

  /**
   * Gets a card at [line, index]
   * @param line a line index
   * @param index an index in the line. A negative index can be used,
   *  indicating an offset from the end of the sequence.
   */
  cardAt(line: number, index: number): number {
    if (index < 0) {
      index = this._desk[line].length + index;
    }
    return this._desk[line][index];
  }

  tableauAt(lineIndex: number): number[] {
    const tableau = [];
    const line = this._desk[lineIndex];

    let j = line.length;
    if (j > 0) {
      tableau.push(line[j - 1]);
      while (--j > 0 && isTableau(line[j - 1], line[j])) {
        tableau.push(line[j - 1]);
      }
    }
    tableau.reverse();
    return tableau;
  }

  asTablaeu(card: number): number[] {
    let tableau = this.tableauAt(this._lineMap[card]);
    const i = tableau.indexOf(card);
    if (i < 0) {
      tableau = [card];
    } else if (i > 0) {
      tableau.splice(0, i);
    }
    return tableau;
  }

  getBestPath(tableau: number[], destination: number): number[] | null {
    // Validity checks:
    if (tableau.length <= 0) {
      return null;
    }

    const lastCard = tableau[tableau.length - 1];
    const source = this._lineMap[lastCard];
    if (this.cardAt(source, -1) !== lastCard) {
      return null;
    }

    // Handle one card tableau.
    if (tableau.length === 1) {
      return isMoveValid(this.basis, this._desk, source, destination) ? [this.basis.toMove(source, destination)] : null;
    }

    const destinationFilter: Filter = { [destination]: true };
    if (this.basis.isPile(destination) && this.lineAt(destination).length === 0) {
      // any empty pile is good as destination.
      for (let i = this.basis.PILE_START; i < this.basis.PILE_END; i++) {
        if (this.lineAt(i).length === 0) {
          destinationFilter[i] = true;
        }
      }
    }

    const filter: Filter = tableau.reduce((obj, key) => { obj[key] = true; return obj; }, {});
    const desk = this._desk.reduce((arr, line) => { arr.push([...line]); return arr; }, [] as number[][]);

    let savedPath = null;
    const callback = (path: Path) => {
      const length = path.length;
      const d = this.basis.toDestination(path[length - 1]);
      if (length <= 0 || !destinationFilter[d]) {
        return false;
      }
      // Is destination equials the tableau?
      const line = desk[d];
      const delta = line.length - tableau.length;
      if (delta < 0) {
        return false;
      }
      for (let i = tableau.length; i-- > 0;) {
        if (tableau[i] !== line[delta + i]) {
          return false;
        }
      }
      savedPath = path;
      return true;
    };

    solve({ basis: this.basis, desk, lastCard, callback, cardFilter: filter });

    if (savedPath) {
      const length = savedPath.length;
      const d = this.basis.toDestination(savedPath[length - 1]);
      if (d !== destination) {
        // Swap destinations.
        for (let i = 0; i < savedPath.length; i++) {
          let src = this.basis.toSource(savedPath[i]);
          let dst = this.basis.toDestination(savedPath[i]);
          if (src === destination) {
            src = d;
          } else if (src === d) {
            src = destination;
          }
          if (dst === destination) {
            dst = d;
          } else if (dst === d) {
            dst = destination;
          }
          savedPath[i] = this.basis.toMove(src, dst);
        }
      }
    }
    return savedPath;
  }

}
