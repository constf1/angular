import { IFreecellDesk } from './freecell-model';

export interface IFreecellWorkerMessage {
  requestId: string | null;
}

export interface IFreecellWorkerInput extends IFreecellWorkerMessage {
  requestId: string;
  desk: IFreecellDesk;
  searchThreshold: number;
}

export interface IFreecellWorkerOutput extends IFreecellWorkerMessage {
  requestId: string;
  path: string;
}
