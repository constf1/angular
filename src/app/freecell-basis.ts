import { rankOf, suitOf, deck, RANK_NUM, CARD_NUM, SUIT_NUM } from './common/deck';

export type FreecellBasis = Readonly<{
  // Constants:
  RANK_NUM: number;
  SUIT_NUM: number;
  CARD_NUM: number;

  PILE_NUM: number;
  CELL_NUM: number;
  BASE_NUM: number;
  DESK_SIZE: number;

  PILE_START: number;
  PILE_END: number;

  BASE_START: number;
  BASE_END: number;

  CELL_START: number;
  CELL_END: number;

  // Methods:
  isBase: (index: number) => boolean;
  isCell: (index: number) => boolean;
  isPile: (index: number) => boolean;
}>;

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

  function isTableau(cardA: number, cardB: number) {
      return rankOf(cardA) === ((rankOf(cardB) + 1) % RANK_NUM) && (suitOf(cardA) % 2) !== (suitOf(cardB) % 2);
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

  function createDesk() {
      const desk = new Array(DESK_SIZE);
      for (let i = 0; i < DESK_SIZE; i++) {
          desk[i] = [];
      }

      function clear() {
          for (let i = 0; i < DESK_SIZE; i++) {
              desk[i].length = 0;
          }
      }

      // A negative index can be used, indicating an offset from the end of the sequence.
      function cardAt(line: number, index: number) {
          if (index < 0) {
              index = desk[line].length + index;
          }
          return desk[line][index];
      }

      function numberOfCardsAt(line: number) {
          return desk[line].length;
      }

      // Copy other desk into itself.
      function from(other) {
          clear();
          for (let i = 0; i < DESK_SIZE; i++) {
              const line = desk[i];
              const count = other.numberOfCardsAt(i);
              for (let j = 0; j < count; j++) {
                  line.push(other.cardAt(i, j));
              }
          }
      }

      function forEachLocus(callback) {
          for (let i = 0; i < DESK_SIZE; i++) {
              const line = desk[i];
              const length = line.length;
              // Call callback. Break out of the loop if it returns true.
              if (callback(i, length > 0 ? line[length - 1] : -1)) {
                  break;
              }
          }
      }

      function getEmptyPile() {
          for (let i = PILE_START; i < PILE_END; i++) {
              if (desk[i].length === 0) {
                  return i;
              }
          }
          return -1;
      }

      function getEmptyCell() {
          for (let i = CELL_START; i < CELL_END; i++) {
              if (desk[i].length === 0) {
                  return i;
              }
          }
          return -1;
      }

      function getBase(card) {
          const suit = suitOf(card);
          const rank = rankOf(card);

          for (let i = BASE_START; i < BASE_END; i++) {
              if (i - BASE_START === suit && desk[i].length === rank) {
                  return i;
              }
          }
          return -1;
      }

      function getMoves(moves, filter) {
          for (let i = 0; i < DESK_SIZE; i++) {
              const src = desk[i];
              if (src.length > 0) {
                  const srcCard = src[src.length - 1];


                  if (filter && !filter(srcCard)) {
                      continue; // Only special cards can be moved.
                  }

                  const srcSuit = suitOf(srcCard);
                  const srcRank = rankOf(srcCard);
                  for (let j = 0; j < DESK_SIZE; j++) {
                      if (i !== j) {
                          const dst = desk[j];
                          const dstCard = dst[dst.length - 1];
                          if (isPile(j)) {
                              if (dst.length === 0) {
                                  // 1. Can move to an empty space.
                                  moves.push(toMove(i, j));
                              } else {
                                  // 2. Can move to a tableau. It should be built down in alternating colors.
                                  if (isTableau(dstCard, srcCard)) {
                                      moves.push(toMove(i, j));
                                  }
                              }
                          } else if (isBase(j)) {
                              if (j - BASE_START === srcSuit && dst.length === srcRank) {
                                  // 3. Can move to the foundation.
                                  moves.push(toMove(i, j));
                              }
                          } else if (isCell(j)) {
                              if (dst.length === 0) {
                                  // 4. Can move to an empty cell.
                                  moves.push(toMove(i, j));
                              }
                          }
                      }
                  }
              }
          }
      }

      function getBestMoves(moves, filter) {
          const emptyCell = getEmptyCell();
          const emptyPile = getEmptyPile();

          for (let i = 0; i < DESK_SIZE; i++) {
              const src = desk[i];
              if (src.length > 0) {
                  const card = src[src.length - 1];
                  if (filter[card]) {
                      // To a tableau.
                      for (let j = PILE_START; j < PILE_END; j++) {
                          if (j !== i) {
                              const dst = desk[j];
                              if (dst.length > 0 && isTableau(dst[dst.length - 1], card)) {
                                  moves.push(toMove(i, j));
                              }
                          }
                      }

                      // To an empty pile.
                      if (emptyPile >= 0) {
                          if (!isPile(i) || src.length > 1) {
                              moves.push(toMove(i, emptyPile));
                          }
                      }

                      // To an empty cell.
                      if (emptyCell >= 0) {
                          if (!isCell(i)) {
                              moves.push(toMove(i, emptyCell));
                          }
                      }

                      // To the base.
                      if (!isBase(i)) {
                          const base = getBase(card);
                          if (base >= 0) {
                              moves.push(toMove(i, base));
                          }
                      }
                  }
              }
          }
      }

      function toKey() {
          return baseToString() + ':' + pileToString();
      }

      function solve(card, cardFilter, destinationFilter, callback) {
          let srcMoves = [[]];
          let dstMoves = [];
          let tmp;
          const moves = [];
          const done = new Set();

          done.add(toKey());

          const startTime = Date.now();

          while (srcMoves.length > 0) {
              for (let i = 0, sl = srcMoves.length; i < sl; i++) {

                  if (Date.now() - startTime > 500) {
                      // It's time to stop the search.
                      console.log('Oops! Search timeout!');
                      return;
                  }

                  const path = srcMoves[i];
                  moveForward(path);

                  moves.length = 0;
                  getBestMoves(moves, cardFilter);

                  for (let j = 0, ml = moves.length; j < ml; j++) {
                      const mov = moves[j];
                      const src = toSource(mov);
                      const dst = toDestination(mov);

                      moveCard(src, dst);

                      // Check if we had it already.
                      const key = toKey();
                      if (!done.has(key)) {
                          const next = path.slice();
                          next.push(mov);

                          if (destinationFilter[dst] && card === cardAt(dst, -1) && callback(next, dst)) {
                              // Restore the desk and return.
                              moveBackward(next);

                              console.log('Search time: ' + (Date.now() - startTime));
                              return;
                          }

                          dstMoves.push(next);
                          done.add(key);
                      }

                      moveCard(dst, src);
                  }
                  moveBackward(path);
              }
              // Swap source and destination:
              tmp = srcMoves;
              srcMoves = dstMoves;
              dstMoves = tmp;
              dstMoves.length = 0;
          }

          console.log('Full search time: ' + (Date.now() - startTime));
      }

      function deal(seed: number) {
          clear();
          const cards = deck(seed);

          for (let i = 0; i < cards.length; i++) {
              desk[PILE_START + (i % PILE_NUM)].push(cards[i]);
          }
          return cards;
      }

      function moveCard(source, destination) {
          desk[destination].push(desk[source].pop());
      }

      function moveForward(moves) {
          for (let i = 0, j = moves.length; i < j; i++) {
              moveCard(toSource(moves[i]), toDestination(moves[i]));
          }
      }

      function moveBackward(moves) {
          for (let i = moves.length; i-- > 0;) {
              moveCard(toDestination(moves[i]), toSource(moves[i]));
          }
      }

      function tableauAt(lineIndex) {
          const tableau = [];
          const line = desk[lineIndex];

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

      function slice(line) {
          return desk[line].slice();
      }

      function baseToString() {
          let buf = '';
          let prefix = ',';
          for (let i = BASE_START; i < BASE_END; i++) {
              buf += prefix + desk[i].length;
              prefix = ',';
          }
          return buf;
      }

      function pileToString() {
          const arr = [];
          for (let i = PILE_START; i < PILE_END; i++) {
              arr.push(desk[i].join(','));
          }
          arr.sort();
          return arr.join(';');
      }

      function countEqualsBackward(lineIndex, cards) {
          const line = desk[lineIndex];
          const lA = line.length;
          const lB = cards.length;
          const lMin = lA < lB ? lA : lB;
          let i = 0;
          while (i < lMin && line[lA - i - 1] === cards[lB - i - 1]) {
              i++;
          }
          return i;
      }

      function buildTableauFrom(card) {
          const tableau = [];
          tableau.push(card);
          for (let i = PILE_START; i < PILE_END; i++) {
              const pile = desk[i];
              let j = pile.indexOf(card);
              if (j >= 0) {
                  while (++j < pile.length && isTableau(card, pile[j])) {
                      card = pile[j];
                      tableau.push(card);
                  }
                  break;
              }
          }
          return tableau;
      }

      function tableauLengthAt(pile) {
          const cascade = desk[pile];
          const length = cascade.length;
          for (let i = length; i-- > 1;) {
              const c1 = cascade[i];
              const s1 = c1 % SUIT_NUM;
              const r1 = (c1 - s1) / SUIT_NUM;

              const c2 = cascade[i - 1];
              const s2 = c2 % SUIT_NUM;
              const r2 = (c2 - s2) / SUIT_NUM;

              if (!(r2 === ((r1 + 1) % RANK_NUM) && (s2 % 2) !== (s1 % 2))) {
                  return length - i;
              }
          }

          return length;
      }

      function canFormTableau(dstIndex, srcIndex) {
          const dstLine = desk[dstIndex];
          const srcLine = desk[srcIndex];
          return dstLine.length > 0 && srcLine.length > 0 && isTableau(dstLine[dstLine.length - 1], srcLine[srcLine.length - 1]);
      }

      function emptyCellCount() {
          let count = 0;
          for (let i = CELL_START; i < CELL_END; i++) {
              if (desk[i].length === 0) {
                  count++;
              }
          }
          return count;
      }

      function emptyPileCount() {
          let count = 0;
          for (let i = PILE_START; i < PILE_END; i++) {
              if (desk[i].length === 0) {
                  count++;
              }
          }
          return count;
      }

      // Desk public interface:
      return {
          // Constants:
          length: desk.length,

          // Const methods:
          emptyCellCount,
          emptyPileCount,
          getBestMoves,
          getBase,
          getEmptyCell,
          getEmptyPile,
          cardAt,
          baseToString,
          buildTableauFrom,
          countEqualsBackward,
          forEachLocus,
          getMoves,
          numberOfCardsAt,
          pileToString,
          slice,
          tableauAt,
          tableauLengthAt,
          canFormTableau,

          // Desk mutators:
          from,
          deal,
          moveBackward,
          moveCard,
          moveForward,

          // Desk solver:
          solve,
      };
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
      isTableau,

      toMove,
      toDestination,
      toSource,

      createDesk
  };
}
