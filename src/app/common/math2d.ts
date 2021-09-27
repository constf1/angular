/* eslint-disable @typescript-eslint/naming-convention */
export enum Direction {
  NorthWest,
  North,
  NorthEast,
  West,
  Center,
  East,
  SouthWest,
  South,
  SouthEast
}

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function hasNorth(direction: Direction): boolean {
  return direction === Direction.NorthWest || direction === Direction.North || direction === Direction.NorthEast;
}

export function hasSouth(direction: Direction): boolean {
  return direction === Direction.SouthWest || direction === Direction.South || direction === Direction.SouthEast;
}

export function hasWest(direction: Direction): boolean {
  return direction === Direction.NorthWest || direction === Direction.West || direction === Direction.SouthWest;
}

export function hasEast(direction: Direction): boolean {
  return direction === Direction.NorthEast || direction === Direction.East || direction === Direction.SouthEast;
}

export function getPointAt(rect: Readonly<Rect>, direction: Direction): Point {
  let x: number;
  let y: number;

  if (hasWest(direction)) {
    x = rect.left;
  } else if (hasEast(direction)) {
    x = rect.right;
  } else {
    x = (rect.left + rect.right) / 2;
  }

  if (hasNorth(direction)) {
    y = rect.top;
  } else if (hasSouth(direction)) {
    y = rect.bottom;
  } else {
    y = (rect.top + rect.bottom) / 2;
  }

  return { x, y };
}

export function isPointOut(rect: Readonly<Rect>, x: number, y: number): boolean {
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
}

export function isPointIn(rect: Readonly<Rect>, x: number, y: number): boolean {
  return !isPointOut(rect, x, y);
}

export function fromPoint(x: number, y: number): Rect {
  return { left: x, top: y, right: x, bottom: y };
}

export function addX(rect: Rect, x: number): void {
  rect.left = Math.min(rect.left, x);
  rect.right = Math.max(rect.right, x);
}

export function addY(rect: Rect, y: number): void {
  rect.top = Math.min(rect.top, y);
  rect.bottom = Math.max(rect.bottom, y);
}

export function addPoint(rect: Rect, x: number, y: number): void {
  addX(rect, x);
  addY(rect, y);
}

export function addRect(rect: Rect, addon: Readonly<Rect>): void {
  addX(rect, addon.left);
  addX(rect, addon.right);
  addY(rect, addon.top);
  addY(rect, addon.bottom);
}

// In general, the angle between two vectors (ux, uy) and (vx, vy) can be computed as
// +- arccos(dot(u, v) / (u.length * v.length),
// where the +- sign is the sign of (ux * vy − uy * vx).
export function twoVectorsAngle(ux: number, uy: number, vx: number, vy: number): number {
  const a2 = Math.atan2(uy, ux);
  const a1 = Math.atan2(vy, vx);
  const sign = a1 > a2 ? -1 : 1;
  const angle1 = a1 - a2;
  const angle2 = angle1 + sign * Math.PI * 2;

  return Math.abs(angle2) < Math.abs(angle1) ? angle2 : angle1;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) * (x2 - x1) * (y2 - y1) * (y2 - y1));
}
