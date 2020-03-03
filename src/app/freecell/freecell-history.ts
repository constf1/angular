import { codeToByte, byteArrayToString } from '../common/math-utils';

export class FreecellHistory {
  private seed: number;
  private path = '';
  private mark = 0;

  get size() {
    return this.path.length / 2;
  }

  get deal() {
    return this.seed;
  }

  get last() {
    return this.mark - 1;
  }

  get next() {
    return this.mark;
  }

  get lastSource() {
    return this.getSource(this.last);
  }

  get lastDestination() {
    return this.getDestination(this.last);
  }

  get nextSource() {
    return this.getSource(this.next);
  }

  get nextDestination() {
    return this.getDestination(this.next);
  }

  get canUndo() {
    return this.mark > 0;
  }

  get canRedo() {
    return this.mark + this.mark < this.path.length;
  }

  protected _decode(index: number): number {
    return codeToByte(this.path.charCodeAt(index));
  }

  protected _encode(...values: number[]): string {
    return byteArrayToString(values);
  }

  getSource(index: number): number {
    return this._decode(index + index);
  }

  getDestination(index: number): number {
    return this._decode(index + index + 1);
  }

  toURI() {
    let uri = 'deal=' + this.deal;
    if (this.path) {
      uri += '&path=' + this.path;
      if (this.canRedo) {
        uri += '&mark=' + this.mark;
      }
    }
    return uri;
  }

  onDeal(deal: number) {
    this.seed = deal;
    this.path = '';
    this.mark = 0;
  }

  undo() {
    if (this.canUndo) {
      this.mark--;
      return true;
    }
    return false;
  }

  redo() {
    if (this.canRedo) {
      this.mark++;
      return true;
    }
    return false;
  }

  onMove(source: number, destination: number) {
    if (
      this.canUndo &&
      this.lastDestination === source &&
      this.lastSource === destination
    ) {
      this.undo();
    } else if (
      this.canRedo &&
      this.nextSource === source &&
      this.nextDestination === destination
    ) {
      this.redo();
    } else {
      this.path =
        (this.canRedo
          ? this.path.substring(0, this.mark + this.mark)
          : this.path) + this._encode(source, destination);
      this.mark++; // mark + mark === path.length
    }
  }
}
