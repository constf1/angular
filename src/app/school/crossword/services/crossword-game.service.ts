import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';
import { CrosswordGame } from '../crossword-game';

export const CrosswordBoardStageNames = ['born', 'init', 'live', 'done'] as const;
export type CrosswordBoardStage = typeof CrosswordBoardStageNames[number];

export interface CrosswordState {
  stage: CrosswordBoardStage;
  game: CrosswordGame | null;
  /* Crossword difficulty: number in the range [0, 1] */
  difficulty: number;
  showMistakes: boolean;
}

export const minState: Readonly<SubType<CrosswordState, number>> = {
  difficulty: 0
};

export const maxState: Readonly<SubType<CrosswordState, number>> = {
  difficulty: 1
};

export const initialState: Readonly<CrosswordState> = {
  stage: 'done',
  game: null,
  difficulty: 0,
  showMistakes: false
};

@Injectable()
export class CrosswordGameService extends StateSubject<CrosswordState> {
  constructor() {
    super(initialState);
  }

  set(params: Partial<Readonly<CrosswordState>>): boolean {
    return this._set(params);
  }
}
