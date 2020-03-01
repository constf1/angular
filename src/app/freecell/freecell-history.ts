import { byteToCode } from '../common/math-utils';

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

  get currentSource() {
    return this.path.charCodeAt(this.mark - 2);
  }

  get currentDestination() {
    return this.path.charCodeAt(this.mark - 1);
  }

  get nextSource() {
    return this.path.charCodeAt(this.mark);
  }

  get nextDestination() {
    return this.path.charCodeAt(this.mark + 1);
  }

  get available() {
    return (this.path.length - this.mark) / 2;
  }

  get canUndo() {
    return this.mark > 0;
  }

  get canRedo() {
    return this.mark < this.path.length;
  }

  toURI() {
    let uri = 'deal=' + this.deal;
    if (this.path) {
      uri += '&path=';
      for (let i = 0; i < this.path.length; i++) {
        uri += String.fromCharCode(byteToCode(this.path.charCodeAt(i)));
      }
      if (this.mark < this.path.length) {
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
      this.mark -= 2;
      return true;
    }
    return false;
  }

  redo() {
    if (this.canRedo) {
      this.mark += 2;
      return true;
    }
    return false;
  }

  onMove(source: number, destination: number) {
    if (
      this.canUndo &&
      this.path.charCodeAt(this.mark - 1) === source &&
      this.path.charCodeAt(this.mark - 2) === destination
    ) {
      this.undo();
    } else if (
      this.canRedo &&
      this.path.charCodeAt(this.mark) === source &&
      this.path.charCodeAt(this.mark + 1) === destination
    ) {
      this.redo();
    } else {
      this.path =
        (this.mark < this.path.length
          ? this.path.substring(0, this.mark)
          : this.path) + String.fromCharCode(source, destination);
      this.mark = this.path.length;
    }
  }
}
