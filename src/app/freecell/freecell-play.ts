import { IFreecellPlay, numberAt } from './freecell-model';
import { FreecellGameView, FreecellGame } from './freecell-game';

export type FreecellPlayCallback = (view: FreecellGameView, giver: number, taker: number, index: number) => void;

export function playForward(play: IFreecellPlay, onmove?: FreecellPlayCallback, onerror?: FreecellPlayCallback): FreecellGame {
  const game = new FreecellGame(play.pile, play.cell, play.base);
  game.deal(play.deal);

  for (let i = 0; i + 1 < play.path.length; i += 2) {
    const giver = numberAt(play.path, i);
    const taker = numberAt(play.path, i + 1);
    if (game.isMoveValid(giver, taker)) {
      game.moveCard(giver, taker);
      if (onmove) {
        onmove(game, giver, taker, i / 2);
      }
    } else {
      if (onerror) {
        onerror(game, giver, taker, i / 2);
      }
      break;
    }
  }
  return game;
}
