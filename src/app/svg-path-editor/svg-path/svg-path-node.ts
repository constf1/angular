// tslint:disable: variable-name

import { Linkable } from '../../common/linkable';
import {
  CurveTo,
  DrawCommand,
  DrawTo,
  EllipticalArc,
  hasControlPoint1,
  hasControlPoint2,
  isClosePath,
  isCurveTo,
  isEllipticalArc,
  isHLineTo,
  isMoveTo,
  isQCurveTo,
  isSmoothCurveTo,
  isSmoothQCurveTo,
  isVLineTo,
  MoveTo,
  QCurveTo,
  SmoothCurveTo,
  SmoothQCurveTo
} from './svg-path-commands';

export type PathNode = Linkable<PathNode> & DrawTo;
export type CurveNode = PathNode & (CurveTo | QCurveTo | SmoothCurveTo | SmoothQCurveTo);
export type SmoothCurveNode = PathNode & (SmoothCurveTo | SmoothQCurveTo);

export function createPathNode(name: DrawCommand, args: string[], prev?: PathNode): PathNode {
  switch (name) {
    case 'Z':
      return { name, prev };
    case 'H':
      return { name, x: +args[0], prev };
    case 'V':
      return { name, y: +args[0], prev };
    case 'M':
    case 'L':
    case 'T':
      return { name, x: +args[0], y: +args[1], prev };
    case 'Q':
      return { name, x1: +args[0], y1: +args[1], x: +args[2], y: +args[3], prev };
    case 'S':
      return { name, x2: +args[0], y2: +args[1], x: +args[2], y: +args[3], prev };
    case 'C':
      return { name, x1: +args[0], y1: +args[1], x2: +args[2], y2: +args[3], x: +args[4], y: +args[5], prev };
    case 'A':
      return { name, rx: +args[0], ry: +args[1], angle: +args[2],
        largeArcFlag: args[3] === '1', sweepFlag: args[4] === '1', x: +args[5], y: +args[6], prev };
  }
}

function getMoveTo(item?: Readonly<PathNode>): Readonly<PathNode & MoveTo> | undefined {
  for (let node = item; node; node = node.prev) {
    if (isMoveTo(node)) {
      return node;
    }
  }
}

export function getX(item?: Readonly<PathNode>): number {
  if (item) {
    if (isClosePath(item)) {
      return getX(getMoveTo(item.prev));
    } else if (isVLineTo(item)) {
      return getX(item.prev);
    } else {
      return item.x;
    }
  }
  return 0;
}

export function getY(item?: Readonly<PathNode>): number {
  if (item) {
    if (isClosePath(item)) {
      return getY(getMoveTo(item.prev));
    } else if (isHLineTo(item)) {
      return getY(item.prev);
    } else {
      return item.y;
    }
  }
  return 0;
}

function getLastControlX(node: Readonly<CurveNode>): number {
  if (hasControlPoint2(node)) {
    return node.x2;
  } else if (isQCurveTo(node)) {
    return node.x1;
  } else {
    return getReflectedX1(node);
  }
}

function getLastControlY(node: Readonly<CurveNode>): number {
  if (hasControlPoint2(node)) {
    return node.y2;
  } else if (isQCurveTo(node)) {
    return node.y1;
  } else {
    return getReflectedY1(node);
  }
}

function isReflectable(node: Readonly<SmoothCurveNode>, prev: Readonly<PathNode>): prev is Readonly<CurveNode> {
  return prev.name === node.name
   || (isCurveTo(prev) && isSmoothCurveTo(node))
   || (isQCurveTo(prev) && isSmoothQCurveTo(node));
}

/**
 * The S/s and T/t commands indicate that the first control point of the given cubic/quadratic
 * Bézier curve is calculated by reflecting the previous path segment's final control point
 * relative to the current point.
 *
 * The exact math is as follows.
 * If the current point is (curx, cury)
 * and the final control point of the previous path segment is (oldx2, oldy2),
 * then the first control point of the current path segment (reflected point) is:
 *
 * (newx1, newy1) = (curx - (oldx2 - curx), cury - (oldy2 - cury)) = (2*curx - oldx2, 2*cury - oldy2)
 */
export function getReflectedX1(node: Readonly<SmoothCurveNode>): number {
  const prev = node.prev;

  let x = getX(prev);
  if (prev && isReflectable(node, prev)) {
    x += x - getLastControlX(prev);
  }
  return x;
}

export function getReflectedY1(node: Readonly<SmoothCurveNode>): number {
  const prev = node.prev;

  let y = getY(prev);
  if (prev && isReflectable(node, prev)) {
    y += y - getLastControlY(prev);
  }
  return y;
}

// Specification: https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
export function getCenterPoint(node: Readonly<PathNode & EllipticalArc>): { x: number, y: number } {
  // Given the following variables:
  // x1 y1 x2 y2 fA fS rx ry phi
  const x1 = getX(node.prev);
  const y1 = getY(node.prev);
  const x2 = node.x;
  const y2 = node.y;

  const fA = node.largeArcFlag;
  const fB = node.sweepFlag;

  // Correction Step 1: Ensure radii are positive
  let rx = Math.abs(node.rx);
  let ry = Math.abs(node.ry);
  // Correction Step 2: Ensure radii are non-zero
  // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop.
  if (rx === 0 || ry === 0) {
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }

  // Step 1: Compute (x1′, y1′)
  const phi = node.angle * Math.PI / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;

  const x1_ =  cosPhi * dx + sinPhi * dy;
  const y1_ = -sinPhi * dx + cosPhi * dy;

  // Correction Step 3: Ensure radii are large enough
  const L = (x1_ * x1_ * ry * ry + y1_ * y1_ * rx * rx) / (rx * rx * ry * ry);
  if (L > 1) {
    // Scale up
    rx *= Math.sqrt(L);
    ry *= Math.sqrt(L);
  }

  // Step 2: Compute (cx′, cy′)
  const M = (fA === fB ? -1 : 1) * Math.sqrt(
    Math.max(rx * rx * ry * ry - rx * rx * y1_ * y1_ - ry * ry * x1_ * x1_, 0) / (rx * rx * y1_ * y1_ + ry * ry * x1_ * x1_)
  );
  const cx_ = M * rx * y1_ / ry;
  const cy_ = M * -ry * x1_ / rx;

  // Step 3: Compute (cx, cy) from (cx′, cy′)
  const cx = (cosPhi * cx_ - sinPhi * cy_) || 0;
  const cy = (sinPhi * cx_ + cosPhi * cy_) || 0;
  return { x: cx + (x1 + x2) / 2, y: cy + (y1 + y2) / 2};
}

export function translateStopPoint(item: PathNode, dx: number, dy: number) {
  if (!isClosePath(item)) {
    if (!isVLineTo(item)) {
      item.x += dx;
    }
    if (!isHLineTo(item)) {
      item.y += dy;
    }
  }
}

export function translateControlPoint1(item: PathNode, dx: number, dy: number) {
  if (hasControlPoint1(item)) {
    item.x1 += dx;
    item.y1 += dy;
  }
}

export function translateControlPoint2(item: PathNode, dx: number, dy: number) {
  if (hasControlPoint2(item)) {
    item.x2 += dx;
    item.y2 += dy;
  }
}

export function translate(item: PathNode, dx: number, dy: number) {
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

export function asString(node: Readonly<PathNode>): string {
  let buf = node.name;
  if (!isClosePath(node)) {
    if (hasControlPoint1(node)) {
      buf += ' ' + node.x1;
      buf += ' ' + node.y1;
    }
    if (hasControlPoint2(node)) {
      buf += ' ' + node.x2;
      buf += ' ' + node.y2;
    }
    if (isEllipticalArc(node)) {
      buf += ' ' + node.rx;
      buf += ' ' + node.ry;
      buf += ' ' + node.angle;
      buf += ' ' + (node.largeArcFlag ? '1' : '0') + (node.sweepFlag ? '1' : '0');
    }
    if (!isVLineTo(node)) {
      buf += ' ' + node.x;
    }
    if (!isHLineTo(node)) {
      buf += ' ' + node.y;
    }
  }
  return buf;
}
