// tslint:disable: variable-name

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UnsubscribableStateSubject } from '../../common/unsubscribable-state-subject';

import { FreecellGameService } from './freecell-game.service';
import { FreecellAutoplayService } from './freecell-autoplay.service';
import { IFreecellMove, IFreecellDesk } from '../freecell-model';
import { IFreecellWorkerInput, IFreecellWorkerOutput } from '../freecell-worker-model';

export interface FreecellActionState {
  canAssist: boolean;
  canUndo: boolean;
  canRedo: boolean;
  nextMove: Readonly<IFreecellMove> | null;
  assistRequest: string | null;
}

const initialValue: Readonly<FreecellActionState> = {
  canAssist: false,
  canUndo: false,
  canRedo: false,
  nextMove: null,
  assistRequest: null
} as const;

// let worker: Worker = null;
// if (typeof Worker !== 'undefined') {
//   // Create a new web worker.
//   worker = new Worker('../freecell.worker', { type: 'module' });
//   worker.onmessage = ({ data }) => {
//     console.log(`page got message: ${data}`);
//   };
//   worker.postMessage('hello');
// } else {
//   // Web workers are not supported in this environment.
//   // You should add a fallback so that your program still executes correctly.
// }

const ACTION_CLOSE = String.fromCharCode(0x0D7); // MULTIPLICATION SIGN

@Injectable({
  providedIn: 'root'
})
export class FreecellActionService extends UnsubscribableStateSubject<FreecellActionState> {
  private _worker: Worker = null;

  constructor(
    private _gameService: FreecellGameService,
    private _playService: FreecellAutoplayService,
    private _snackBar: MatSnackBar
    ) {
    super(initialValue);

    this._createWorker();

    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      const nextState = { ...initialValue };
      const game = this._gameService.game;
      const count = game.countEmpty();

      if (count < game.PILE_NUM + game.CELL_NUM) {
        const moves = game.getMoves();
        nextState.canAssist = !!this._worker && moves.length > 0 && count <= game.CELL_NUM;
        for (const move of moves) {
          if (game.isBase(move.taker)) {
            nextState.nextMove = move;
            break;
          }
        }
      }

      nextState.canUndo = state.mark > 0;
      nextState.canRedo = 2 * state.mark < state.path.length;

      // Update state in the next frame.
      Promise.resolve().then(() => this._set(nextState));
    }));
  }

  undo() {
    const mark = this._gameService.state.mark - 1;
    if (mark >= 0) {
      this._gameService.mark = mark;
    }
  }

  redo() {
    const mark = this._gameService.state.mark + 1;
    if (mark + mark <= this._gameService.state.path.length) {
      this._gameService.mark = mark;
    }
  }

  next() {
    const nextMove = this.state.nextMove;
    if (nextMove) {
      this._gameService.move(nextMove.giver, nextMove.taker);
    }
  }

  playNext() {
    this._playService.play(() => {
      this.next();
      return !!this.state.nextMove;
    });
  }

  play(path: string) {
    this._playService.play(() => {
      if (path.length > 1) {
        const giver = path.charCodeAt(0);
        const taker = path.charCodeAt(1);
        path = path.substring(2);
        this._gameService.move(giver, taker);
      }
      return path.length > 1;
    });
  }

  assist() {
    if (!this._worker) {
      return;
    }

    const game = this._gameService.game;
    const desk: IFreecellDesk = {
        base: game.BASE_NUM,
        cell: game.CELL_NUM,
        pile: game.PILE_NUM,
        desk: game.toArray()
    };
    const assistRequest = JSON.stringify(desk);
    const message: IFreecellWorkerInput = {
      requestId: assistRequest,
      desk
    };
    this._worker.postMessage(message);
    this._set({ assistRequest, canAssist: false });
  }

  private _createWorker() {
    if (typeof Worker !== 'undefined') {
      // Create a new web worker.
      this._worker = new Worker('../freecell.worker', { type: 'module' });
      this._worker.onmessage = (event: MessageEvent) => {
        const data = event.data as IFreecellWorkerOutput;
        if (data.requestId === this.state.assistRequest) {
          let message = 'Unable to assist ;-(';
          if (data.path) {
            message = 'Assisting...';
            this.play(data.path);
          }
          this._snackBar.open(message, ACTION_CLOSE, { duration: 2000 });
          this._set({ assistRequest: initialValue.assistRequest });
        }
      };
    }
  }
}
