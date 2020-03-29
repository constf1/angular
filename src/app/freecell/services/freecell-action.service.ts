// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { UnsubscribableStateSubject } from '../../common/unsubscribable-state-subject';
import { FreecellGameService } from './freecell-game.service';
import { FreecellAutoplayService } from './freecell-autoplay.service';

export interface FreecellActionState {
  canUndo: boolean;
  canRedo: boolean;
  nextMove: Readonly<{ source: number, destination: number }> | null;
}

const initialValue: FreecellActionState = {
  canUndo: false,
  canRedo: false,
  nextMove: null
};

@Injectable({
  providedIn: 'root'
})
export class FreecellActionService extends UnsubscribableStateSubject<FreecellActionState> {
  get canUndo() {
    return this.state.canUndo;
  }

  get canRedo() {
    return this.state.canRedo;
  }

  get nextMove() {
    return this.state.nextMove;
  }

  constructor(private _gameService: FreecellGameService, private _playService: FreecellAutoplayService) {
    super(initialValue);

    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      this._stateSubject.next({
        canUndo: state.mark > 0,
        canRedo: 2 * state.mark < state.path.length,
        nextMove: state.game?.findMoveToBase()
      });
    }));
  }

  undo() {
    if (this.canUndo) {
      this._gameService.set({ mark: this._gameService.state.mark - 1 });
    }
  }

  redo() {
    if (this.canRedo) {
      this._gameService.set({ mark: this._gameService.state.mark + 1 });
    }
  }

  next() {
    if (this.nextMove) {
      this._gameService.move(this.nextMove.source, this.nextMove.destination);
    }
  }

  playNext() {
    this._playService.play(() => {
      this.next();
      return !!this.nextMove;
    });
  }
}
