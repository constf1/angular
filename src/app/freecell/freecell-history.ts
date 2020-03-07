import { codeToByte, byteArrayToString } from '../common/math-utils';
import { commonPrefix } from '../common/string-utils';

export function toNumber(path: string, index: number): number {
  return codeToByte(path.charCodeAt(index));
}

export function toString(...values: number[]): string {
  return byteArrayToString(values);
}

// tslint:disable: variable-name
export class FreecellHistory {
  private _deal = -1;
  private _mark = 0;

  constructor(private _path = '') {
    this._mark = _path.length;
  }

  get size() {
    return this._path.length / 2;
  }

  get deal() {
    return this._deal;
  }

  set deal(deal: number) {
    this._deal = deal;
    this._path = '';
    this._mark = 0;
  }

  get last() {
    return this._mark - 1;
  }

  get mark() {
    return this._mark;
  }

  get path() {
    return this._path;
  }

  get lastSource() {
    return this.getSource(this.last);
  }

  get lastDestination() {
    return this.getDestination(this.last);
  }

  get nextSource() {
    return this.getSource(this.mark);
  }

  get nextDestination() {
    return this.getDestination(this.mark);
  }

  get canUndo() {
    return this._mark > 0;
  }

  get canRedo() {
    return this._mark + this._mark < this._path.length;
  }

  getSource(index: number): number {
    return toNumber(this._path, index + index);
  }

  getDestination(index: number): number {
    return toNumber(this._path, index + index + 1);
  }

  toURI() {
    let uri = 'deal=' + this.deal;
    if (this._path) {
      uri += '&path=' + this._path;
      if (this.canRedo) {
        uri += '&mark=' + this._mark;
      }
    }
    return uri;
  }

  undo() {
    if (this.canUndo) {
      this._mark--;
      return true;
    }
    return false;
  }

  redo() {
    if (this.canRedo) {
      this._mark++;
      return true;
    }
    return false;
  }

  onMove(source: number, destination: number): number {
    if (
      this.canUndo &&
      this.lastDestination === source &&
      this.lastSource === destination
    ) {
      this.undo();
      return -1;
    } else if (
      this.canRedo &&
      this.nextSource === source &&
      this.nextDestination === destination
    ) {
      this.redo();
      return 1;
    } else {
      this._path =
        (this.canRedo
          ? this._path.substring(0, this._mark + this._mark)
          : this._path) + toString(source, destination);
      this._mark++; // mark + mark === path.length
      return 0;
    }
  }

  countEqualMoves(path: string) {
    return Math.floor(commonPrefix(this._path, path).length / 2);
  }
}
