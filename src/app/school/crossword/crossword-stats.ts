import { CrosswordGame } from './crossword-game';

export type CrosswordStats = {
  wordTotal: number;
  wordSolved: number;
  letterTotal: number;
  letterStatic: number;
  letterSolved: number;
};

export function getStats(game: Readonly<CrosswordGame>) {
  return {
    wordTotal: game.xItems.length + game.yItems.length,
    wordSolved: game.getSolvedXWordIndices().length + game.getSolvedYWordIndices().length,
    letterTotal: game.cells.length,
    letterStatic: game.countStatic,
    letterSolved: game.countSolved
  };
}
