export type Desk = Readonly<Readonly<number[]>[]>;

export class FreecellBasis {
  public readonly DESK_SIZE: number;
  public readonly PILE_START = 0;
  public readonly PILE_END: number;
  public readonly BASE_START: number;
  public readonly BASE_END: number;
  public readonly CELL_START: number;
  public readonly CELL_END: number;

  constructor(
    public readonly PILE_NUM: number, // cascades
    public readonly CELL_NUM: number, // open cells
    public readonly BASE_NUM: number  // foundation piles
  ) {
    this.DESK_SIZE = PILE_NUM + CELL_NUM + BASE_NUM;
    this.PILE_END = this.BASE_START = this.PILE_START + this.PILE_NUM;
    this.BASE_END = this.CELL_START = this.BASE_START + this.BASE_NUM;
    this.CELL_END = this.CELL_START + this.CELL_NUM;
  }

  isPile(index: number) {
    return index >= this.PILE_START && index < this.PILE_END;
  }

  isBase(index: number) {
    return index >= this.BASE_START && index < this.BASE_END;
  }

  isCell(index: number) {
    return index >= this.CELL_START && index < this.CELL_END;
  }

  getSpotName(index: number) {
    if (this.isBase(index)) {
      return 'base ' + (index - this.BASE_START);
    }
    if (this.isPile(index)) {
      return 'pile ' + (index - this.PILE_START);
    }
    if (this.isCell(index)) {
      return 'cell ' + (index - this.CELL_START);
    }
    return 'unknown ' + index;
  }
}
