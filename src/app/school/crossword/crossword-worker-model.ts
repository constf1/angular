import { Grid } from './crossword-model';

export interface CrosswordWorkerMessage {
  requestId: string | null;
}

export interface CrosswordWorkerInput extends CrosswordWorkerMessage {
  requestId: string;
  maxHeight: number;
  maxWidth: number;
  tryCount: number;
  words: string[];
}

export interface CrosswordWorkerOutput extends CrosswordWorkerMessage {
  requestId: string;
  isWorking: boolean;
  grid: Grid | null;
}
