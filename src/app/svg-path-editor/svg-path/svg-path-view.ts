import { asString, CurveTo, EllipticalArc, isCurveTo, isSmoothCurveTo, QCurveTo, SmoothCurveTo } from './svg-path-commands';
import { getCenterParams, getReflectedX1, getReflectedY1, getX, getY, PathNode, SmoothCurveNode } from './svg-path-node';

export function getCurveControlHandles(node: Readonly<PathNode & (CurveTo | QCurveTo | SmoothCurveTo)>): string {
  if (isCurveTo(node)) {
    return `M${getX(node.prev)} ${getY(node.prev)}L${node.x1} ${node.y1}`
      +  `M${node.x2} ${node.y2}L${node.x} ${node.y}`;
  } else if (isSmoothCurveTo(node)) {
    return `M${node.x2} ${node.y2}L${node.x} ${node.y}`;
  } else {
    return `M${getX(node.prev)} ${getY(node.prev)}L${node.x1} ${node.y1}L${node.x} ${node.y}`;
  }
}

export function getReflectedCurveTangentLines(node: Readonly<SmoothCurveNode>): string {
  if (isSmoothCurveTo(node)) {
    return `M${getX(node.prev)} ${getY(node.prev)}L${getReflectedX1(node)} ${getReflectedY1(node)}`;
  } else {
    return `M${getX(node.prev)} ${getY(node.prev)}L${getReflectedX1(node)} ${getReflectedY1(node)}L${node.x} ${node.y}`;
  }
}

export function getReflectedEllipticalArc(node: Readonly<PathNode & EllipticalArc>) {
  const { cx, cy, phi } = getCenterParams(node);

  const sa = `M${node.x} ${node.y}L${cx} ${cy}L${getX(node.prev)} ${getY(node.prev)}`
    + asString({ ...node, largeArcFlag: !node.largeArcFlag, sweepFlag: !node.sweepFlag}, -1);

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  let dx = cosPhi * node.rx;
  let dy = sinPhi * node.rx;
  const sb = `M${cx - dx} ${cy - dy}l${2 * dx} ${2 * dy}`;

  dx = -sinPhi * node.ry;
  dy = cosPhi * node.ry;
  const sc = `M${cx - dx} ${cy - dy}l${2 * dx} ${2 * dy}`;

  return sa + sb + sc;
}
