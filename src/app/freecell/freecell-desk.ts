import { deck, isTableau, suitOf, rankOf } from '../common/deck';
import { copy } from '../common/array-utils';
import { FreecellBasis } from './freecell-basis';

export class FreecellDesk extends FreecellBasis {
  private readonly desk: number[][] = [];

  constructor(pileNum: number, cellNum: number, baseNum: number) {
    super(pileNum, cellNum, baseNum);
    for (let i = 0; i < this.DESK_SIZE; i++) {
      this.desk.push([]);
    }
  }

  /**
   * Returns a copy of the desk.
   */
  toArray(): number[][] {
    return copy(this.desk);
  }

  /**
   * Clears the game.
   */
  clear() {
    for (let i = this.desk.length; i-- > 0; ) {
      this.desk[i].length = 0;
    }
  }

  addCard(destination: number, card: number) {
    this.desk[destination].push(card);
  }

  /**
   * Gets a card at [index, offset]
   * @param index a line index
   * @param offset an offset in the line. A negative value can be used,
   *  indicating an offset from the end of the sequence.
   */
  getCard(index: number, offset: number) {
    const line = this.desk[index];
    if (offset < 0) {
      offset = line.length + offset;
    }
    return offset >= 0 && offset < line.length ? line[offset] : -1;
  }

  getLine(index: number): Readonly<number[]> {
    return this.desk[index];
  }

  getTableauAt(index: number): number[] {
    const tableau = [];
    const line = this.desk[index];

    let j = line.length;
    if (j > 0) {
      tableau.push(line[j - 1]);
      while (
        --j > 0 &&
        isTableau(line[j - 1], line[j]) &&
        rankOf(line[j - 1]) > 0) {
        tableau.push(line[j - 1]);
      }
    }
    tableau.reverse();
    return tableau;
  }

  countEmptyCells(): number {
    let count = 0;
    for (let i = this.CELL_START; i < this.CELL_END; i++) {
      if (this.desk[i].length === 0) {
        count++;
      }
    }
    return count;
  }

  countEmptyPiles(): number {
    let count = 0;
    for (let i = this.PILE_START; i < this.PILE_END; i++) {
      if (this.desk[i].length === 0) {
        count++;
      }
    }
    return count;
  }

  countEmpty(): number {
    return this.countEmptyCells() + this.countEmptyPiles();
  }

  getEmptyCell(): number {
    for (let i = this.CELL_START; i < this.CELL_END; i++) {
      if (this.desk[i].length === 0) {
        return i;
      }
    }
    return -1;
  }

  getEmptyPile(): number {
    for (let i = this.PILE_START; i < this.PILE_END; i++) {
      if (this.desk[i].length === 0) {
        return i;
      }
    }
    return -1;
  }

  getBase(card: number): number {
    const suit = suitOf(card);
    const rank = rankOf(card);

    for (let i = 0; i < this.BASE_NUM; i++) {
      if (suitOf(i) === suit && this.desk[i + this.BASE_START].length === rank) {
        return i + this.BASE_START;
      }
    }
    return -1;
  }

  /**
   * Makes a new deal.
   * @param seed seed number
   */
  deal(seed?: number) {
    // console.log('Deal:', seed);
    const cards = deck(seed);

    this.clear();
    for (let i = 0; i < cards.length; i++) {
      this.addCard(this.PILE_START + (i % this.PILE_NUM), cards[i]);
    }
    return cards;
  }

  isMoveValid(source: number, destination: number): boolean {
    if (source === destination) {
      // Empty move.
      return false;
    }

    if (source < 0 || source >= this.DESK_SIZE) {
      // Source is out of range.
      return false;
    }

    if (destination < 0 || destination >= this.DESK_SIZE) {
      // Destination is out of range.
      return false;
    }

    const srcLength = this.desk[source].length;
    if (srcLength <= 0) {
      return false;
    }

    const dstLength = this.desk[destination].length;
    if (this.isCell(destination)) {
      return dstLength === 0;
    }

    const card = this.desk[source][srcLength - 1];
    if (this.isPile(destination)) {
      return (
        dstLength === 0 ||
        isTableau(this.desk[destination][dstLength - 1], card)
      );
    }

    if (this.isBase(destination)) {
      const suit = suitOf(card);
      const rank = rankOf(card);
      return (
        suitOf(destination - this.BASE_START) === suit && dstLength === rank
      );
    }

    return false;
  }

  /**
   * Pops the last card from the `source` line and add it to the `destination`
   * @param source source line
   * @param destination destination line
   */
  moveCard(source: number, destination: number) {
    this.addCard(destination, this.desk[source].pop());
    // if (this.isMoveValid(source, destination)) {
    //   this.addCard(destination, this.desk[source].pop());
    //   return true;
    // }
    // return false;
  }

  findMoves(callback: (source: number, destination: number) => boolean) {
    for (let i = this.DESK_SIZE; i-- > 0;) {
      for (let j = i; j-- > 0;) {
        if (i !== j) {
          if ((this.isMoveValid(i, j) && callback(i, j)) || (this.isMoveValid(j, i) && callback(j, i))) {
            return;
          }
        }
      }
    }
  }
}

export type FreecellDeskView = Omit<FreecellDesk, 'moveCard' | 'deal' | 'addCard' | 'clear'>;
