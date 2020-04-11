import { commonPrefix } from '../common/string-utils';
import { codeToByte, byteArrayToString } from '../common/math-utils';

export interface IFreecellBasis {
  base: number;
  cell: number;
  pile: number;
}

export interface IFreecellDesk extends IFreecellBasis {
  desk: number[][];
}

export interface IFreecellMove {
  giver: number;
  taker: number;
}

export interface IFreecellPlay extends IFreecellBasis {
  deal: number;
  path: string;
}

export interface IFreecellReplay extends IFreecellPlay {
  mark: number;
}

export function countEqualMoves(pathA: string, pathB: string) {
  return Math.floor(commonPrefix(pathA, pathB).length / 2);
}

export function numberAt(path: string, index: number): number {
  return codeToByte(path.charCodeAt(index));
}

export function giverAt(path: string, mark: number): number {
  return numberAt(path, mark + mark - 2);
}

export function takerAt(path: string, mark: number): number {
  return numberAt(path, mark + mark - 1);
}

export function toString(...values: number[]): string {
  return byteArrayToString(values);
}

export function nextPath(path: string, mark: number, giver: number, taker: number): string {
  if (mark > 0) {
    if (taker === giverAt(path, mark) && giver === takerAt(path, mark)) {
      // undo the last move
      return path.substring(0, mark + mark - 2);
    }
  }
  // append
  return path.substring(0, mark + mark) + toString(giver, taker);
}
