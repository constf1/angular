import { formatDecimal } from 'src/app/common/math-utils';
import { SubType } from 'src/app/common/types';

export type MoveTo = {
  name: 'M';
  x: number;
  y: number;
};

export type LineTo = {
  name: 'L';
  x: number;
  y: number;
};

export type HLineTo = {
  name: 'H';
  x: number;
};

export type VLineTo = {
  name: 'V';
  y: number;
};

export type ClosePath = {
  name: 'Z';
};

export type CurveTo = {
  name: 'C';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type SmoothCurveTo = {
  name: 'S';
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type QCurveTo = {
  name: 'Q';
  x1: number;
  y1: number;
  x: number;
  y: number;
};

export type SmoothQCurveTo = {
  name: 'T';
  x: number;
  y: number;
};

export type EllipseShape = {
  rx: number;
  ry: number;
  angle: number;
  largeArcFlag: boolean;
  sweepFlag: boolean;
};

export type EllipticalArc = EllipseShape & {
  name: 'A';
  x: number;
  y: number;
};

export type DrawTo = MoveTo | LineTo | HLineTo | VLineTo | ClosePath | CurveTo | SmoothCurveTo | QCurveTo | SmoothQCurveTo | EllipticalArc;
export type DrawCommand = DrawTo['name'];

export type DrawNumberParam =
  | keyof SubType<MoveTo, number>
  | keyof SubType<LineTo, number>
  | keyof SubType<HLineTo, number>
  | keyof SubType<VLineTo, number>
  | keyof SubType<ClosePath, number>
  | keyof SubType<CurveTo, number>
  | keyof SubType<SmoothCurveTo, number>
  | keyof SubType<QCurveTo, number>
  | keyof SubType<SmoothQCurveTo, number>
  | keyof SubType<EllipticalArc, number>
  ;

export type DrawBooleanParam =
  | keyof SubType<MoveTo, boolean>
  | keyof SubType<LineTo, boolean>
  | keyof SubType<HLineTo, boolean>
  | keyof SubType<VLineTo, boolean>
  | keyof SubType<ClosePath, boolean>
  | keyof SubType<CurveTo, boolean>
  | keyof SubType<SmoothCurveTo, boolean>
  | keyof SubType<QCurveTo, boolean>
  | keyof SubType<SmoothQCurveTo, boolean>
  | keyof SubType<EllipticalArc, boolean>
  ;

export type DrawParam = DrawNumberParam | DrawBooleanParam;

// Type Guards:
export function isMoveTo(item: DrawTo): item is MoveTo {
  return item.name === 'M';
}

export function isLineTo(item: DrawTo): item is LineTo {
  return item.name === 'L';
}

export function isHLineTo(item: DrawTo): item is HLineTo {
  return item.name === 'H';
}

export function isVLineTo(item: DrawTo): item is VLineTo {
  return item.name === 'V';
}

export function isClosePath(item: DrawTo): item is ClosePath {
  return item.name === 'Z';
}

export function isCurveTo(item: DrawTo): item is CurveTo {
  return item.name === 'C';
}

export function isSmoothCurveTo(item: DrawTo): item is SmoothCurveTo {
  return item.name === 'S';
}

export function isQCurveTo(item: DrawTo): item is QCurveTo {
  return item.name === 'Q';
}

export function isSmoothQCurveTo(item: DrawTo): item is SmoothQCurveTo {
  return item.name === 'T';
}

export function isEllipticalArc(item: DrawTo): item is EllipticalArc {
  return item.name === 'A';
}

export function hasControlPoint1(item: DrawTo): item is CurveTo | QCurveTo {
  return isCurveTo(item) || isQCurveTo(item);
}

export function hasControlPoint2(item: DrawTo): item is CurveTo | SmoothCurveTo {
  return isCurveTo(item) || isSmoothCurveTo(item);
}

export function isBezierCurve(item: DrawTo): item is CurveTo | SmoothCurveTo | QCurveTo | SmoothQCurveTo {
  return isCurveTo(item) || isSmoothCurveTo(item) || isQCurveTo(item) || isSmoothQCurveTo(item);
}

export const COMMAND_FULL_NAMES: { [key in DrawCommand]: string } = {
  M: 'MoveTo',
  L: 'LineTo',
  H: 'Horizontal LineTo',
  V: 'Vertical LineTo',
  C: 'Cubic Bézier Curve',
  S: 'Smooth Cubic Bézier Curve',
  Q: 'Quadratic Bézier Curve',
  T: 'Smooth Quadratic Bézier Curve',
  A: 'Elliptical Arc Curve',
  Z: 'ClosePath',
} as const;

function formatDigit(value: number, fractionDigits?: number) {
  return ' ' + (fractionDigits < 0 ? value.toString() : formatDecimal(value, fractionDigits));
}

export function formatParams(item: Readonly<DrawTo>, x0: number, y0: number, fractionDigits?: number): string {
  let buf = '';
  if (!isClosePath(item)) {
    if (hasControlPoint1(item)) {
      buf += formatDigit(item.x1 - x0, fractionDigits);
      buf += formatDigit(item.y1 - y0, fractionDigits);
    }
    if (hasControlPoint2(item)) {
      buf += formatDigit(item.x2 - x0, fractionDigits);
      buf += formatDigit(item.y2 - y0, fractionDigits);
    }
    if (isEllipticalArc(item)) {
      buf += formatDigit(item.rx, fractionDigits);
      buf += formatDigit(item.ry, fractionDigits);
      buf += formatDigit(item.angle, fractionDigits);
      buf += ' ' + (item.largeArcFlag ? '1' : '0') + (item.sweepFlag ? '1' : '0');
    }

    if (!isVLineTo(item)) {
      buf += formatDigit(item.x - x0, fractionDigits);
    }
    if (!isHLineTo(item)) {
      buf += formatDigit(item.y - y0, fractionDigits);
    }
  }
  return buf;
}

/**
 * Returns a string representing the draw command in absolute form.
 * @param item SVG path single draw command
 * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
 */
export function asString(item: Readonly<DrawTo>, fractionDigits?: number): string {
  return item.name + formatParams(item, 0, 0, fractionDigits);
}

export function translate(item: DrawTo, dx: number, dy: number) {
  if (!isClosePath(item)) {
    if (!isVLineTo(item)) {
      item.x += dx;
    }
    if (!isHLineTo(item)) {
      item.y += dy;
    }
    if (hasControlPoint1(item)) {
      item.x1 += dx;
      item.y1 += dy;
    }
    if (hasControlPoint2(item)) {
      item.x2 += dx;
      item.y2 += dy;
    }
  }
}

export function translateStopPoint(item: DrawTo, dx: number, dy: number) {
  if (!isClosePath(item)) {
    if (!isVLineTo(item)) {
      item.x += dx;
    }
    if (!isHLineTo(item)) {
      item.y += dy;
    }
  }
}

export function translateControlPoint1(item: DrawTo, dx: number, dy: number) {
  if (hasControlPoint1(item)) {
    item.x1 += dx;
    item.y1 += dy;
  }
}

export function translateControlPoint2(item: DrawTo, dx: number, dy: number) {
  if (hasControlPoint2(item)) {
    item.x2 += dx;
    item.y2 += dy;
  }
}
