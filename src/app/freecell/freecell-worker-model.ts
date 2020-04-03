import { IFreecellDesk } from './freecell-model';

export interface IFreecellWorkerInput {
  requestId: string;
  desk: IFreecellDesk;
}

export interface IFreecellWorkerOutput {
  requestId: string;
  path: string;
}
