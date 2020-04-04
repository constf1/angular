/// <reference lib="webworker" />

import { Autoplay } from '../common/autoplay';

import { IFreecellWorkerInput, IFreecellWorkerOutput } from './freecell-worker-model';
import { FreecellSolver } from './freecell-solver';

const player = new Autoplay(1);

addEventListener('message', (event: MessageEvent) => {
  const data = event.data as IFreecellWorkerInput;
  // console.log('Worker:', data.requestId);
  const requestId = data.requestId;
  if (!requestId) {
    player.stop();
  } else {
    const desk = data.desk;
    const solver = new FreecellSolver(desk.pile, desk.cell, desk.base, desk.desk);
    const countEmptyMin = solver.countEmpty();
    const countFullMin = solver.countCardsInBases();

    solver.onMove = (card: number, src: number, dst: number) => {
      const countEmpty = solver.countEmpty();
      let success = false;
      if (countEmpty > countEmptyMin) {
        success = true;
      } else if (countEmpty === countEmptyMin) {
        const countFull = solver.countCardsInBases();
        if (countFull > countFullMin) {
          success = true;
        }
      }
      if (success || solver.doneSize > data.searchThreshold) {
        const replay: IFreecellWorkerOutput = { requestId, path: success ? solver.getPath() : '' };
        postMessage(replay);
        solver.stop(success);
      }
    };
    solver.prepare();
    player.play(() => solver.nextIteration());
  }
});
