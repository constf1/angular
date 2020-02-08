import { rankOf, suitOf, RANK_NUM, CARD_NUM, SUIT_NUM } from './common/deck';

export function isTableau(cardA: number, cardB: number) {
  return rankOf(cardA) === ((rankOf(cardB) + 1) % RANK_NUM) && (suitOf(cardA) % 2) !== (suitOf(cardB) % 2);
}

export function createFreecellBasis(pileNum: number, cellNum: number, baseNum: number) {
  const PILE_NUM = pileNum; // cascades
  const CELL_NUM = cellNum; // open cells
  const BASE_NUM = baseNum; // foundation piles
  const DESK_SIZE = PILE_NUM + CELL_NUM + BASE_NUM;

  const PILE_START = 0;
  const PILE_END = PILE_START + PILE_NUM;

  const BASE_START = PILE_END;
  const BASE_END = BASE_START + BASE_NUM;

  const CELL_START = BASE_END;
  const CELL_END = CELL_START + CELL_NUM;

  function isPile(index: number) {
    return index >= PILE_START && index < PILE_END;
  }

  function isBase(index: number) {
    return index >= BASE_START && index < BASE_END;
  }

  function isCell(index: number) {
    return index >= CELL_START && index < CELL_END;
  }

  function toMove(source: number, destination: number) {
    return source * DESK_SIZE + destination;
  }

  function toDestination(move: number) {
    return move % DESK_SIZE;
  }

  function toSource(move: number) {
    return (move - (move % DESK_SIZE)) / DESK_SIZE;
  }

  return {
    // Constants:
    RANK_NUM,
    SUIT_NUM,
    CARD_NUM,

    PILE_NUM,
    CELL_NUM,
    BASE_NUM,
    DESK_SIZE,

    PILE_START,
    PILE_END,

    BASE_START,
    BASE_END,

    CELL_START,
    CELL_END,

    // Methods:
    isBase,
    isCell,
    isPile,

    toMove,
    toDestination,
    toSource
  };
}

export type FreecellBasis = Readonly<ReturnType<typeof createFreecellBasis>>;
export type FreecellDesk = Readonly<number[][]>;
export type Path = Readonly<number[]>;
export type Filter = { [card: number]: boolean; } | boolean[];

export function baseToString({ BASE_START, BASE_END }: FreecellBasis, desk: FreecellDesk): string {
  let buf = '';
  let prefix = '';
  for (let i = BASE_START; i < BASE_END; i++) {
    buf += prefix + desk[i].length;
    prefix = ',';
  }
  return buf;
}

export function pileToString({ PILE_START, PILE_END }: FreecellBasis, desk: FreecellDesk): string {
  const arr = [];
  for (let i = PILE_START; i < PILE_END; i++) {
    arr.push(desk[i].join(','));
  }
  arr.sort();
  return arr.join(';');
}

export function toKey(basis: FreecellBasis, desk: FreecellDesk) {
  return baseToString(basis, desk) + ':' + pileToString(basis, desk);
}

export function getEmptyCell({ CELL_START, CELL_END }: FreecellBasis, desk: FreecellDesk): number {
  for (let i = CELL_START; i < CELL_END; i++) {
    if (desk[i].length === 0) {
      return i;
    }
  }
  return -1;
}

export function getEmptyPile({ PILE_START, PILE_END }: FreecellBasis, desk: FreecellDesk): number {
  for (let i = PILE_START; i < PILE_END; i++) {
    if (desk[i].length === 0) {
      return i;
    }
  }
  return -1;
}

export function getBase({ BASE_START, BASE_END }: FreecellBasis, desk: FreecellDesk, card: number): number {
  const suit = suitOf(card);
  const rank = rankOf(card);

  for (let i = BASE_START; i < BASE_END; i++) {
    if (i - BASE_START === suit && desk[i].length === rank) {
      return i;
    }
  }
  return -1;
}

export function getMoves(
  basis: FreecellBasis,
  desk: FreecellDesk,
  moves: number[],
  filter?: Filter
  ) {
  const emptyCell = getEmptyCell(basis, desk);
  const emptyPile = getEmptyPile(basis, desk);
  const { PILE_START, PILE_END, DESK_SIZE } = basis;

  for (let i = 0; i < DESK_SIZE; i++) {
    const src = desk[i];
    if (src.length > 0) {
      const card = src[src.length - 1];
      if (!filter || filter[card]) {
        // To a tableau.
        for (let j = PILE_START; j < PILE_END; j++) {
          if (j !== i) {
            const dst = desk[j];
            if (dst.length > 0 && isTableau(dst[dst.length - 1], card)) {
              moves.push(basis.toMove(i, j));
            }
          }
        }

        // To an empty pile.
        if (emptyPile >= 0) {
          if (!basis.isPile(i) || src.length > 1) {
            moves.push(basis.toMove(i, emptyPile));
          }
        }

        // To an empty cell.
        if (emptyCell >= 0) {
          if (!basis.isCell(i)) {
            moves.push(basis.toMove(i, emptyCell));
          }
        }

        // To the base.
        if (!basis.isBase(i)) {
          const base = getBase(basis, desk, card);
          if (base >= 0) {
              moves.push(basis.toMove(i, base));
          }
        }
      }
    }
  }
}

export function moveForward(basis: FreecellBasis, desk: number[][], moves: Path): void {
  for (let i = 0, j = moves.length; i < j; i++) {
    const source = basis.toSource(moves[i]);
    const destination = basis.toDestination(moves[i]);
    desk[destination].push(desk[source].pop());
  }
}

export function moveBackward(basis: FreecellBasis, desk: number[][], moves: Path): void {
  for (let i = moves.length; i-- > 0;) {
    const source = basis.toDestination(moves[i]);
    const destination = basis.toSource(moves[i]);
    desk[destination].push(desk[source].pop());
  }
}

export function solve(task: {
  basis: FreecellBasis,
  desk: number[][],
  lastCard: number,
  callback: (path: Path) => boolean,
  cardFilter?: Filter,
  }) {
  const { basis, desk, lastCard, callback, cardFilter } = task;
  const buffers: number[][][] = [[[]], []];
  const moves: number[] = [];

  const done = new Set<string>();
  done.add(toKey(basis, desk));

  const startTime = Date.now();

  for (let index = 0; buffers[index].length > 0; index = (index + 1) % 2) {
    const input = buffers[index];
    const output = buffers[(index + 1) % 2];

    for (const path of input) {

      if (Date.now() - startTime > 500) {
        // It's time to stop the search.
        console.log('Oops! Search timeout!');
        return;
      }

      moveForward(basis, desk, path);

      moves.length = 0;
      getMoves(basis, desk, moves, cardFilter);

      for (const move of moves) {
        const source = basis.toSource(move);
        const destination = basis.toDestination(move);
        const card = desk[source].pop();
        desk[destination].push(card);

        // Check if we had it already.
        const key = toKey(basis, desk);
        if (!done.has(key)) {
          const next = [...path, move];
          if (card === lastCard && callback(next)) {
            // Don't restore the desk, just return.
            // You can call moveBackward(game, next); to restore the desk
            console.log('Search time: ' + (Date.now() - startTime));
            return;
          }

          output.push(next);
          done.add(key);
        }

        desk[destination].pop();
        desk[source].push(card);
      }
      moveBackward(basis, desk, path);
    }
    // Swap input nad output:
    input.length = 0;
  }

  console.log('Full search time: ' + (Date.now() - startTime));
}
