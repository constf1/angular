import { FreecellBasis } from './freecell-basis';

function linearTransition(start: number, end: number, ratio: number): number {
  return start + (end - start) * ratio;
}

export class FreecellLayout {
  itemWidth: number;
  itemHeight: number;
  deltaWidth: number;
  deltaHeight: number;

  // Cells:
  cellStartX: number;
  cellEndX: number;
  cellStartY: number;
  cellEndY: number;

  // Bases:
  baseStartX: number;
  baseEndX: number;
  baseStartY: number;
  baseEndY: number;

  // Piles
  pileStartX: number;
  pileEndX: number;
  pileStartY: number;
  pileEndY: number;

  get width() {
    return (
      this.deltaWidth + Math.max(this.baseEndX, this.cellEndX, this.pileEndX)
    );
  }

  get height() {
    return (
      this.deltaHeight + Math.max(this.baseEndY, this.cellEndY, this.pileEndY)
    );
  }

  constructor(
    public readonly basis: FreecellBasis,
    dx = 1,
    dy = 1,
    cx = 2,
    cy = 2
  ) {
    this.itemWidth = cx;
    this.itemHeight = cy;
    this.deltaWidth = dx;
    this.deltaHeight = dy / 2;

    this.cellStartX = dx;
    this.cellStartY = this.deltaHeight;
    this.cellEndX = this.cellStartX + basis.CELL_NUM * (cx + dx) - dx;
    this.cellEndY = this.cellStartY + cy;

    this.baseStartX = this.cellEndX + dx;
    this.baseStartY = this.cellStartY;
    this.baseEndX = this.baseStartX + basis.BASE_NUM * (cx + dx) - dx;
    this.baseEndY = this.cellEndY;

    this.pileStartX = dx;
    this.pileStartY = this.cellEndY + dy;
    this.pileEndX = this.pileStartX + basis.PILE_NUM * (cx + dx) - dx;
    this.pileEndY = this.pileStartY + 3.5 * cy;
  }

  getCellX(index: number): number {
    return linearTransition(
      this.cellStartX,
      this.cellEndX - this.itemWidth,
      index / (this.basis.CELL_NUM - 1)
    );
  }

  getCellY(index: number): number {
    return this.cellStartY;
  }

  getBaseX(index: number): number {
    return linearTransition(
      this.baseStartX,
      this.baseEndX - this.itemWidth,
      index / (this.basis.BASE_NUM - 1)
    );
  }

  getBaseY(index: number): number {
    return this.baseStartY;
  }

  getPileX(index: number): number {
    return linearTransition(
      this.pileStartX,
      this.pileEndX - this.itemWidth,
      index / (this.basis.PILE_NUM - 1)
    );
  }

  getPileY(index: number): number {
    return this.pileStartY;
  }

  getSpotPosition(index: number): { x: number; y: number } {
    const basis = this.basis;
    if (basis.isBase(index)) {
      index -= basis.BASE_START;
      return {
        x: this.getBaseX(index),
        y: this.getBaseY(index)
      };
    } else if (basis.isCell(index)) {
      index -= basis.CELL_START;
      return {
        x: this.getCellX(index),
        y: this.getCellY(index)
      };
    } else if (basis.isPile(index)) {
      index -= basis.PILE_START;
      return {
        x: this.getPileX(index),
        y: this.getPileY(index)
      };
    }
    return { x: 0, y: 0 };
  }

  getCardPosition(
    spotIndex: number,
    cardIndex: number,
    cardCount: number
  ): { x: number; y: number } {
    const basis = this.basis;
    const pos = this.getSpotPosition(spotIndex);
    if (basis.isPile(spotIndex)) {
      if (cardCount > 0) {
        const dh = Math.min(
          (this.pileEndY - this.pileStartY - this.itemHeight) / (cardCount - 1),
          this.itemHeight * 0.4
        );
        pos.y += dh * cardIndex;
      }
    }
    return pos;
  }
}
