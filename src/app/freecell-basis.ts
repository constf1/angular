import { rankOf, suitOf, deck, RANK_NUM, CARD_NUM, SUIT_NUM } from './common/deck';

function isTableau(cardA: number, cardB: number) {
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
