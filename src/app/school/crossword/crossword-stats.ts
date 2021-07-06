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
    wordTotal: game.xWords.length + game.yWords.length,
    wordSolved: game.getSolvedXWordIndices().length + game.getSolvedYWordIndices().length,
    letterTotal: game.cells.length,
    letterStatic: game.countStatic,
    letterSolved: game.countSolved
  };
}
