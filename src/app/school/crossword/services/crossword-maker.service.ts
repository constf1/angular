// tslint:disable: variable-name
import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { Grid } from '../crossword-model';
import { CrosswordWorkerInput, CrosswordWorkerMessage, CrosswordWorkerOutput } from '../crossword-worker-model';

function getBestGrid(grid1: Grid | null, grid2: Grid | null): Grid | null {
  if (grid1) {
    if (grid2) {
      if (grid2.xWords.length + grid2.yWords.length > grid1.xWords.length + grid1.yWords.length) {
        return grid2;
      }
    }
    return grid1;
  }
  return grid2;
}

export interface CrosswordMakerState {
  requestId: string;
  isWorking: boolean;
  grid: Readonly<Grid> | null;
  words: ReadonlyArray<string>;
}

const initialValue: Readonly<CrosswordMakerState> = {
  requestId: '',
  isWorking: false,
  grid: null,
  words: [],
};

@Injectable()
export class CrosswordMakerService extends StateSubject<CrosswordMakerState> {
  private _worker: Worker = null;

  constructor() {
    super(initialValue);
    this._createWorker();
  }

  stop() {
    if (!this._worker) {
      return;
    }

    if (this.state.isWorking) {
      const message: CrosswordWorkerMessage = {
        requestId: null
      };
      this._worker.postMessage(message);
      this._set({ isWorking: false });
    }
  }

  makePuzzle(words: ReadonlyArray<string>, maxWidth: number, maxHeight: number) {
    if (!this._worker) {
      return;
    }
    this.stop();

    const requestId = JSON.stringify(words);
    const message: CrosswordWorkerInput = {
      requestId, maxWidth, maxHeight,
      tryCount: 2,
      words: words.slice()
    };
    this._worker.postMessage(message);
    this._set({ requestId, words, isWorking: true, grid: null });
  }

  private _createWorker() {
    if (typeof Worker !== 'undefined') {
      // Create a new web worker.
      this._worker = new Worker('../crossword.worker', { type: 'module' });
      this._worker.onmessage = (event: MessageEvent<CrosswordWorkerOutput>) => {
        const state = this.state;
        const data = event.data;
        // Take the worker's data.
        if (state.isWorking && state.requestId === data.requestId) {
          this._set({
            grid: getBestGrid(state.grid, data.grid),
            isWorking: data.isWorking
          });
        }
      };
    } else {
      // [INFO](https://angular.io/guide/web-worker)
      // Web workers are not supported in this environment.
      // TODO: Add a fallback so that the program can still executes correctly.
    }
  }
}
