/// <reference lib="webworker" />

import { IFreecellWorkerInput, IFreecellWorkerOutput } from './freecell-worker-model';
import { FreecellSolver } from './freecell-solver';

addEventListener('message', (event: MessageEvent) => {
  const data = event.data as IFreecellWorkerInput;
  // const desk = JSON.parse(data) as IFreecellDesk;
  console.log('Worker:', data.requestId);

  const desk = data.desk;
  const solver = new FreecellSolver(desk.pile, desk.cell, desk.base, desk.desk);
  const countEmptyMin = solver.countEmpty();
  const countFullMin = solver.countCardsInBases();

  solver.searchTime = 5000;
  solver.onMove = (card: number, src: number, dst: number) => {
    const countEmpty = solver.countEmpty();
    if (countEmpty > countEmptyMin) {
      solver.stop(true);
    } else if (countEmpty === countEmptyMin) {
      const countFull = solver.countCardsInBases();
      if (countFull > countFullMin) {
        solver.stop(true);
      }
    }
  };

  const message: IFreecellWorkerOutput = {
    requestId: data.requestId,
    path: solver.solve() ? solver.getPath() : ''
  };
  postMessage(message);
});
