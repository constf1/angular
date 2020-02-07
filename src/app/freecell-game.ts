import { FreecellBasis } from './freecell-basis';
import { deck, CARD_NUM } from './common/deck';

export class FreecellGame {
  private desk: number[][];

  get length() {
    return this.desk.length;
  }

  constructor(public readonly basis: FreecellBasis) {
    this.desk = [];
    for (let i = this.basis.DESK_SIZE; i-- > 0;) {
      this.desk.push([]);
    }
  }

  /**
   * Clears the game.
   */
  clear() {
    for (let i = this.basis.DESK_SIZE; i-- > 0;) {
      this.desk[i].length = 0;
    }
  }

  /**
   * Returns a line of cards
   * @param line a line index
   */
  lineAt(line: number): Readonly<number[]> {
    return this.desk[line];
  }

  mapCardToLine() {
    const cards: number[] = [];
    for (let i = this.desk.length; i-- > 0;) {
      const line = this.desk[i];
      for (let j = line.length; j-- > 0;) {
        cards[line[j]] = i;
      }
    }
    return cards;
  }

  numberOfCardsAt(line: number) {
    return this.desk[line].length;
  }

  /**
   * Gets a card at [line, index]
   * @param line a line index
   * @param index an index in the line. A negative index can be used,
   *  indicating an offset from the end of the sequence.
   */
  cardAt(line: number, index: number): number {
    if (index < 0) {
      index = this.desk[line].length + index;
    }
    return this.desk[line][index];
  }

  deal(seed?: number) {
    this.clear();
    const cards = deck(seed);

    const PILE_START = this.basis.PILE_START;
    const PILE_NUM = this.basis.PILE_NUM;

    for (let i = 0; i < cards.length; i++) {
        this.desk[PILE_START + (i % PILE_NUM)].push(cards[i]);
    }
    return cards;
  }

}
