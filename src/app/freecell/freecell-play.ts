// tslint:disable: variable-name

import { IFreecellPlay, numberAt, nextPath, IFreecellReplay } from './freecell-model';
import { FreecellGameView, FreecellGame } from './freecell-game';

export type FreecellPlayCallback = (view: FreecellGameView, giver: number, taker: number, index: number) => void;

export function playForward(
  play: Readonly<IFreecellPlay>,
  onmove?: FreecellPlayCallback,
  onerror?: FreecellPlayCallback): FreecellGame {

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

export function playToMark(
  play: Readonly<IFreecellReplay>,
  onmove?: FreecellPlayCallback,
  onerror?: FreecellPlayCallback): FreecellGame {
  return playForward({ ...play, path: play.path.substring(0, play.mark * 2) }, onmove, onerror);
}

export function getValidPath(play: Readonly<IFreecellPlay>): string {
  let path = '';
  const onmove: FreecellPlayCallback = (_v, giver, taker, _i) => {
    path = nextPath(path, path.length / 2, giver, taker);
  };
  const onerror: FreecellPlayCallback = (_v, _g, _t, i) => {
    console.warn('Invalid subpath:', play.path.substring(i + i));
  };
  playForward(play, onmove, onerror);
  return path;
}
