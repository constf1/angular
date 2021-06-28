import { Injectable } from '@angular/core';
import { StateSubject } from 'src/app/common/state-subject';
import { SubType } from 'src/app/common/types';
import { CrosswordBoard } from './crossword-board';

export const CrosswordBoardStageNames = ['born', 'init', 'live', 'done'] as const;
export type CrosswordBoardStage = typeof CrosswordBoardStageNames[number];

export interface CrosswordBoardState {
  stage: CrosswordBoardStage;
  board: CrosswordBoard | null;
  /* Crossword difficulty: number in the range [0, 1] */
  difficulty: number;
  showMistakes: boolean;
}

export const minState: Readonly<SubType<CrosswordBoardState, number>> = {
  difficulty: 0
};

export const maxState: Readonly<SubType<CrosswordBoardState, number>> = {
  difficulty: 1
};

export const initialState: Readonly<CrosswordBoardState> = {
  stage: 'done',
  board: null,
  difficulty: 0,
  showMistakes: false
};

@Injectable()
export class CrosswordBoardService extends StateSubject<CrosswordBoardState> {
  constructor() {
    super(initialState);
  }

  set(params: Partial<Readonly<CrosswordBoardState>>): boolean {
    return this._set(params);
  }
}
