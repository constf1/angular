import { FreecellBasis } from './freecell-basis';

export function createFreecellLayout(basis: FreecellBasis, dx = 1, dy = 1, cx = 2, cy = 2) {
  const cellStartX = dx;
  const cellEndX = cellStartX + basis.CELL_NUM * (cx + dx);

  const cellStartY = dy;
  const cellEndY = cellStartY + cy;

  const baseStartX = cellEndX;
  const baseEndX = baseStartX + basis.BASE_NUM * (cx + dx);

  const baseStartY = cellStartY;
  const baseEndY = cellEndY;

  const pileStartX = dx;
  const pileEndX = pileStartX + basis.PILE_NUM * (cx + dx);
  const pileStartY = cellEndY + dy;
  const pileEndY = pileStartY + 5 * cy;

  const width = Math.max(baseEndX, cellEndX, pileEndX);
  const height = Math.max(baseEndY, cellEndY, pileEndY) + cy + dy;

  function linearTransition(start: number, end: number, ratio: number): number {
    return start + (end - start) * ratio;
  }

  return {
    get basis() {
      return basis;
    },
    itemWidth: cx,
    itemHeight: cy,
    deltaWidth: dx,
    deltaHeight: dy,
    // Cells:
    cellStartX,
    cellEndX,
    cellStartY,
    cellEndY,
    getCellX(index: number): number {
      return linearTransition(this.cellStartX, this.cellEndX, index / basis.CELL_NUM);
    },
    getCellY(index: number): number {
      return this.cellStartY;
    },
    // Bases:
    baseStartX,
    baseEndX,
    baseStartY,
    baseEndY,
    getBaseX(index: number): number {
      return linearTransition(this.baseStartX, this.baseEndX, index / basis.BASE_NUM);
    },
    getBaseY(index: number): number {
      return this.baseStartY;
    },
    // Piles
    pileStartX,
    pileEndX,
    pileStartY,
    pileEndY,
    getPileX(index: number): number {
      return linearTransition(this.pileStartX, this.pileEndX, index / basis.PILE_NUM);
    },
    getPileY(index: number): number {
      return this.pileStartY;
    },
    // Places
    getX(index: number): number {
      if (basis.isBase(index)) {
        return this.getBaseX(index - basis.BASE_START);
      }
      if (basis.isCell(index)) {
        return this.getCellX(index - basis.CELL_START);
      }
      if (basis.isPile(index)) {
        return this.getPileX(index - basis.PILE_START);
      }
      return 0;
    },
    getY(index: number): number {
      if (basis.isBase(index)) {
        return this.getBaseY(index - basis.BASE_START);
      }
      if (basis.isCell(index)) {
        return this.getCellY(index - basis.CELL_START);
      }
      if (basis.isPile(index)) {
        return this.getPileY(index - basis.PILE_START);
      }
      return 0;
    },
    // Cards
    getCardX(spotIndex: number, cardIndex: number, cardCount: number): number {
      if (basis.isCell(spotIndex)) {
        return this.getCellX(spotIndex - basis.CELL_START);
      }
      if (basis.isBase(spotIndex)) {
        return this.getBaseX(spotIndex - basis.BASE_START);
      }
      if (basis.isPile(spotIndex)) {
        return this.getPileX(spotIndex - basis.PILE_START);
      }
      return 0;
    },
    getCardY(spotIndex: number, cardIndex: number, cardCount: number): number {
      if (basis.isCell(spotIndex)) {
        return this.getCellY(spotIndex - basis.CELL_START);
      }
      if (basis.isBase(spotIndex)) {
        return this.getBaseY(spotIndex - basis.BASE_START);
      }
      if (basis.isPile(spotIndex)) {
        const y = this.getPileY(spotIndex - basis.PILE_START);
        const h = this.pileEndY - this.pileStartY;
        if (cardCount > 0) {
          const dh = Math.min(h / cardCount, dy);
          return linearTransition(y, y + dh * cardCount, cardIndex / cardCount);
        }
        return y;
      }
      return 0;
    },
    // Total Size:
    width, height
  };
}

export type FreecellLayout = ReturnType<typeof createFreecellLayout>;
