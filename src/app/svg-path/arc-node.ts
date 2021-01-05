// tslint:disable: variable-name
import { EllipticalArc } from './command';
import { getX, getY, PathNode } from './node';

// In general, the angle between two vectors (ux, uy) and (vx, vy) can be computed as
// +- arccos(dot(u, v) / (u.length * v.length),
// where the +- sign is the sign of (ux * vy − uy * vx).
function twoVectorsAngle(ux: number, uy: number, vx: number, vy: number): number {
  // const ul = Math.sqrt(ux * ux + uy * uy);
  // const vl = Math.sqrt(vx * vx + vy * vy);
  // const dot = ux * vx + uy * vy;
  // const sign = ux * vy - uy * vx < 0 ? -1 : 1;  // Math.sign(0) returns 0
  // return sign * Math.acos(Math.max(-1, Math.min(1, dot / (ul * vl))));

  const a2 = Math.atan2(uy, ux);
  const a1 = Math.atan2(vy, vx);
  const sign = a1 > a2 ? -1 : 1;
  const angle1 = a1 - a2;
  const angle2 = angle1 + sign * Math.PI * 2;

  return (Math.abs(angle2) < Math.abs(angle1)) ? angle2 : angle1;
}

export type EllipseParams = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  phi: number;
};

export type EllipticalArcParams = EllipseParams & {
  theta?: number;
  deltaTheta?: number;
};

// Specification: https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
export function getCenterParams(node: Readonly<PathNode & EllipticalArc>): EllipticalArcParams {
  // Given the following variables:
  // x1 y1 x2 y2 fA fS rx ry phi
  const x1 = getX(node.prev);
  const y1 = getY(node.prev);
  const x2 = node.x;
  const y2 = node.y;

  const fA = node.largeArcFlag;
  const fB = node.sweepFlag;

  const phi = node.angle * Math.PI / 180;

  // Correction Step 1: Ensure radii are positive
  let rx = Math.abs(node.rx);
  let ry = Math.abs(node.ry);
  // Correction Step 2: Ensure radii are non-zero
  // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop.
  if (rx === 0 || ry === 0) {
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, rx, ry, phi };
  }

  // Step 1: Compute (x1′, y1′)
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

  // Step 4: Compute theta and deltaTheta
  const ux = (x1_ - cx_) / rx;
  const uy = (y1_ - cy_) / ry;
  const vx = -(x1_ + cx_) / rx;
  const vy = -(y1_ + cy_) / ry;
  const theta = twoVectorsAngle(1, 0, ux, uy) || 0;

  let deltaTheta = twoVectorsAngle(ux, uy, vx, vy) || 0;
  if (fB) {
    // deltaTheta should be >= 0
    if (deltaTheta < 0) {
      deltaTheta += 2 * Math.PI;
    }
  } else {
    // deltaTheta should be <= 0
    if (deltaTheta > 0) {
      deltaTheta -= 2 * Math.PI;
    }
  }

  return { cx: cx + (x1 + x2) / 2, cy: cy + (y1 + y2) / 2, rx, ry, phi, theta, deltaTheta };
}

export function getEllipsePoint(ellipse: Readonly<EllipseParams>, theta: number) {
  // An arbitrary point (x, y) on the elliptical arc can be described by the 2-dimensional matrix equation
  // https://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
  const cosPhi = Math.cos(ellipse.phi);
  const sinPhi = Math.sin(ellipse.phi);

  const x1 = ellipse.rx * Math.cos(theta);
  const y1 = ellipse.ry * Math.sin(theta);

  const x1_ = cosPhi * x1 - sinPhi * y1;
  const y1_ = sinPhi * x1 + cosPhi * y1;

  const x = x1_ + ellipse.cx;
  const y = y1_ + ellipse.cy;

  return { x, y };
}

// Derivative of
// cos'(theta) = -sin(theta)
// sin'(theta) = cos(theta)
//
// x'(theta) = cosPhi * rx * cos'(theta) - sinPhi * ry * sin'(theta);
// y'(theta) = sinPhi * rx * cos'(theta) + cosPhi * ry * sin'(theta);
//
// x'(theta) = -cosPhi * rx * Math.sin(theta) - sinPhi * ry * Math.cos(theta);
// y'(theta) = -sinPhi * rx * Math.sin(theta) + cosPhi * ry * Math.cos(theta);
export function getEllipseTangent(ellipse: Readonly<EllipseParams>, theta: number) {
  const cosPhi = Math.cos(ellipse.phi);
  const sinPhi = Math.sin(ellipse.phi);

  const dx1 = -ellipse.rx * Math.sin(theta);
  const dy1 = ellipse.ry * Math.cos(theta);

  const x = cosPhi * dx1 - sinPhi * dy1;
  const y = sinPhi * dx1 + cosPhi * dy1;

  return { x, y };
}

export function ellipticalArcToCurve(
  x0: number, y0: number,
  x: number, y: number,
  ellipse: Readonly<EllipseParams>,
  theta1: number, theta2: number): PathNode {
  const t1 = getEllipseTangent(ellipse, theta1);
  const t2 = getEllipseTangent(ellipse, theta2);

  const t = 4 * Math.tan((theta2 - theta1) / 4) / 3;

  const x1 = x0 + t * t1.x;
  const y1 = y0 + t * t1.y;
  const x2 = x - t * t2.x;
  const y2 = y - t * t2.y;

  return { name: 'C', x1, y1, x2, y2, x, y };
}

export function approximateEllipticalArc(node: Readonly<PathNode & EllipticalArc>): PathNode[] {
  const ellipse = getCenterParams(node);
  if (ellipse.rx <= 0 || ellipse.ry <= 0 || !ellipse.deltaTheta) {
    // Treat this as a straight line and stop.
    return [{ name: 'L' , x: node.x, y: node.y }];
  }

  const x0 = getX(node.prev);
  const y0 = getY(node.prev);

  // Determine the number of curves to use in the approximation.
  const { theta, deltaTheta } = ellipse;
  if (Math.abs(deltaTheta) > 4 * Math.PI / 3) {
    // Three-part split.
    const theta1 = theta + deltaTheta / 3;
    const theta2 = theta + 2 * deltaTheta / 3;
    const theta3 = theta + deltaTheta;

    const p1 = getEllipsePoint(ellipse, theta1);
    const p2 = getEllipsePoint(ellipse, theta2);

    return [
      ellipticalArcToCurve(x0, y0, p1.x, p1.y, ellipse, theta, theta1),
      ellipticalArcToCurve(p1.x, p1.y, p2.x, p2.y, ellipse, theta1, theta2),
      ellipticalArcToCurve(p2.x, p2.y, node.x, node.y, ellipse, theta2, theta3)
    ];
  } else if (Math.abs(deltaTheta) > 2 * Math.PI / 3) {
    // Two-part split.
    const theta1 = theta + deltaTheta / 2;
    const theta2 = theta + deltaTheta;

    const p1 = getEllipsePoint(ellipse, theta1);

    return [
      ellipticalArcToCurve(x0, y0, p1.x, p1.y, ellipse, theta, theta1),
      ellipticalArcToCurve(p1.x, p1.y, node.x, node.y, ellipse, theta1, theta2)
    ];
  } else {
    return [ellipticalArcToCurve(x0, y0, node.x, node.y, ellipse, theta, theta + deltaTheta)];
  }
}
