/// <reference lib="webworker" />

import { IFreecellDesk } from './freecell-model';
import { FreecellSolver } from './freecell-solver';

addEventListener('message', ({ data }) => {
  const desk = JSON.parse(data) as IFreecellDesk;
  console.log('Worker:', desk);

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
  postMessage(solver.solve() ? solver.getPath() : '');
});
