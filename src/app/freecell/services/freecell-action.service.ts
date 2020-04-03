// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { UnsubscribableStateSubject } from '../../common/unsubscribable-state-subject';
import { FreecellGameService } from './freecell-game.service';
import { FreecellAutoplayService } from './freecell-autoplay.service';
import { IFreecellMove, IFreecellDesk } from '../freecell-model';

export interface FreecellActionState {
  canAssist: boolean;
  canUndo: boolean;
  canRedo: boolean;
  nextMove: Readonly<IFreecellMove> | null;
}

const initialValue: Readonly<FreecellActionState> = {
  canAssist: false,
  canUndo: false,
  canRedo: false,
  nextMove: null
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


@Injectable({
  providedIn: 'root'
})
export class FreecellActionService extends UnsubscribableStateSubject<FreecellActionState> {
  private _worker: Worker = null;

  constructor(private _gameService: FreecellGameService, private _playService: FreecellAutoplayService) {
    super(initialValue);

    if (typeof Worker !== 'undefined') {
      // Create a new web worker.
      this._worker = new Worker('../freecell.worker', { type: 'module' });
      this._worker.onmessage = ({ data }) => {
        if (data) {
          console.log('Worker has got a message for you:', data);
          this.play(data);
        } else {
          console.log('Worker was unable to assist ;-(');
        }
      };
    }

    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      const nextState = { ...initialValue };
      const game = this._gameService.game;
      const count = game.countEmpty();

      if (count < game.PILE_NUM + game.CELL_NUM) {
        const moves = game.getMoves();
        nextState.canAssist = moves.length > 0 && count <= game.CELL_NUM;
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
    const game = this._gameService.game;
    const desk: IFreecellDesk = {
        base: game.BASE_NUM,
        cell: game.CELL_NUM,
        pile: game.PILE_NUM,
        desk: game.toArray()
    };
    this._worker.postMessage(JSON.stringify(desk));
  }
}
