// tslint:disable: variable-name

import { formatDecimal } from '../common/math-utils';
import { append, Linkable } from '../common/linkable';
import {
  CurveTo,
  DrawCommand,
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
  QCurveTo,
  SmoothCurveTo } from './svg-path/svg-path-commands';
import {
  asString,
  createPathNode,
  getCenterPoint,
  getReflectedX1,
  getReflectedY1,
  getX,
  getY,
  PathNode,
  SmoothCurveNode,
  translate,
  translateStopPoint} from './svg-path/svg-path-node';

function formatDigit(value: number, fractionDigits?: number) {
  return ' ' + (fractionDigits < 0 ? value.toString() : formatDecimal(value, fractionDigits));
}

function formatParams(node: Readonly<PathNode>, x0: number, y0: number, fractionDigits?: number): string {
  let buf = '';
  if (!isClosePath(node)) {
    if (hasControlPoint1(node)) {
      buf += formatDigit(node.x1 - x0, fractionDigits);
      buf += formatDigit(node.y1 - y0, fractionDigits);
    }
    if (hasControlPoint2(node)) {
      buf += formatDigit(node.x2 - x0, fractionDigits);
      buf += formatDigit(node.y2 - y0, fractionDigits);
    }
    if (isEllipticalArc(node)) {
      buf += formatDigit(node.rx, fractionDigits);
      buf += formatDigit(node.ry, fractionDigits);
      buf += formatDigit(node.angle, fractionDigits);
      buf += ' ' + (node.largeArcFlag ? '1' : '0') + (node.sweepFlag ? '1' : '0');
    }

    if (!isVLineTo(node)) {
      buf += formatDigit(node.x - x0, fractionDigits);
    }
    if (!isHLineTo(node)) {
      buf += formatDigit(node.y - y0, fractionDigits);
    }
  }
  return buf;
}

function asFormattedString(node: Readonly<PathNode>, asRelative?: boolean, maximumFractionDigits?: number): string {
  if (asRelative) {
    return node.name.toLowerCase() + formatParams(node, getX(node.prev), getY(node.prev), maximumFractionDigits);
  } else {
    return node.name + formatParams(node, 0, 0, maximumFractionDigits);
  }
}

function getCurveControlHandles(node: Readonly<PathNode & (CurveTo | QCurveTo | SmoothCurveTo)>): string {
  if (isCurveTo(node)) {
    return `M${getX(node.prev)} ${getY(node.prev)}L${node.x1} ${node.y1}`
      +  `M${node.x2} ${node.y2}L${node.x} ${node.y}`;
  } else if (isSmoothCurveTo(node)) {
    return `M${node.x2} ${node.y2}L${node.x} ${node.y}`;
  } else {
    return `M${getX(node.prev)} ${getY(node.prev)}L${node.x1} ${node.y1}L${node.x} ${node.y}`;
  }
}

function getReflectedCurveTangentLines(node: Readonly<SmoothCurveNode>): string {
  if (isSmoothCurveTo(node)) {
    return `M${getX(node.prev)} ${getY(node.prev)}L${getReflectedX1(node)} ${getReflectedY1(node)}`;
  } else {
    return `M${getX(node.prev)} ${getY(node.prev)}L${getReflectedX1(node)} ${getReflectedY1(node)}L${node.x} ${node.y}`;
  }
}

function getReflectedEllipticalArc(node: Readonly<PathNode & EllipticalArc>) {
  const center = getCenterPoint(node);

  const sa = `M${node.x} ${node.y}L${center.x} ${center.y}L${getX(node.prev)} ${getY(node.prev)}`
    + asString({ ...node, largeArcFlag: !node.largeArcFlag, sweepFlag: !node.sweepFlag});

  const phi = node.angle * Math.PI / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  let dx = cosPhi * node.rx;
  let dy = sinPhi * node.rx;
  const sb = `M${center.x - dx} ${center.y - dy}l${2 * dx} ${2 * dy}`;

  dx = -sinPhi * node.ry;
  dy = cosPhi * node.ry;
  const sc = `M${center.x - dx} ${center.y - dy}l${2 * dx} ${2 * dy}`;

  return sa + sb + sc;
}

export type PathItem = PathNode & Linkable<PathItem> & { isSelected?: boolean, outputAsRelative?: boolean };
export type ControlPoint = {
  readonly item: Readonly<PathItem>;
  readonly type: 'move' | 'curve1' | 'curve2';
  readonly x: number;
  readonly y: number;
  translate(dx: number, dy: number): void;
};

class MoveControlPoint implements ControlPoint {
  readonly type = 'move';

  constructor(readonly item: PathItem) {}

  get x() {
    return getX(this.item);
  }

  get y() {
    return getY(this.item);
  }

  translate(dx: number, dy: number) {
    const item = this.item;
    if (item.isSelected) {
      // Translate all selected items.
      const x0 = this.x;
      const y0 = this.y;
      translate(item, dx, dy);

      dx = this.x - x0;
      dy = this.y - y0;
      if (dx !== 0 || dy !== 0) {
        for (let node = item.next; node; node = node.next) {
          if (node.isSelected) {
            translate(node, dx, dy);
          }
        }
      }
    } else {
      translateStopPoint(item, dx, dy);
    }
  }
}

class Curve1ControlPoint implements ControlPoint {
  readonly type = 'curve1';

  constructor(readonly item: PathItem & (CurveTo | QCurveTo)) {}

  get x() {
    return this.item.x1;
  }

  get y() {
    return this.item.y1;
  }

  translate(dx: number, dy: number) {
    this.item.x1 += dx;
    this.item.y1 += dy;
  }
}

class Curve2ControlPoint implements ControlPoint {
  readonly type = 'curve2';

  constructor(readonly item: PathItem & (CurveTo | SmoothCurveTo)) {}

  get x() {
    return this.item.x2;
  }

  get y() {
    return this.item.y2;
  }

  translate(dx: number, dy: number) {
    this.item.x2 += dx;
    this.item.y2 += dy;
  }
}


const RE_COMMAND = /([MLHVZCSQTA])/gi;
const RE_FLAG = /[01]/;
const RE_SIGNED = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
const RE_UNSIGNED = /[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;

/**
 * [Path Doc](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
 */
const REXPS: {[key in DrawCommand]: Readonly<RegExp[]>} = {
  // Move To:
  //  M x y
  //  m dx dy
  M: [RE_SIGNED, RE_SIGNED],

  // Line To:
  // L x y
  // l dx dy
  L: [RE_SIGNED, RE_SIGNED],

  // Horizontal Line To:
  // H x
  // h dx
  H: [RE_SIGNED],

  // Vertical Line To:
  // V y
  // v dy
  V: [RE_SIGNED],

  // Close Path.
  Z: [],

  // Bézier curves:

  // Curve To:
  // C x1 y1, x2 y2, x y
  // c dx1 dy1, dx2 dy2, dx dy
  C: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Shortcut Curve To:
  // S x2 y2, x y
  // s dx2 dy2, dx dy
  S: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Quadratic Curve To:
  // Q x1 y1, x y
  // q dx1 dy1, dx dy
  Q: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],

  // Shortcut Quadratic Curve To:
  // T x y
  // t dx dy
  T: [RE_SIGNED, RE_SIGNED],

  // Arc To:
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
  A: [RE_UNSIGNED, RE_UNSIGNED, RE_SIGNED, RE_FLAG, RE_FLAG, RE_SIGNED, RE_SIGNED],
};

/**
 * Helper class.
 */

class Reader {
  private _data = '';

  set data(value: string) {
    this._data = value.trim();
  }

  get data() {
    return this._data;
  }

  moveTo(start: number) {
    this.data = this.data.slice(start);
  }

  read(exp: RegExp): string | null {
    exp.lastIndex = 0;
    const m = exp.exec(this.data);
    if (m !== null) {
      const value = m[0];
      this.moveTo(m.index + value.length);
      return value;
    }
    return null;
  }

  readAll(exps: Readonly<RegExp[]>): string[] | null {
    const buf: string[] = [];
    for (const exp of exps) {
      const value = this.read(exp);
      if (value !== null) {
        buf.push(value);
      } else {
        return null;
      }
    }
    return buf;
  }
}

export class SvgPathModel {
  private _nodes: PathItem[] = [];
  private _controlPoints: ControlPoint[] = [];

  get nodes(): ReadonlyArray<Readonly<PathItem>> {
    return this._nodes;
  }

  get controls(): ReadonlyArray<ControlPoint> {
    return this._controlPoints;
  }

  get count() {
    return this._nodes.length;
  }

  get selectedCount() {
    let count = 0;
    for (const node of this._nodes) {
      if (node.isSelected) {
        count++;
      }
    }
    return count;
  }

  get firstSelectionIndex() {
    for (let i = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].isSelected) {
        return i;
      }
    }
    return -1;
  }

  get hasSelection(): boolean {
    return this.firstSelectionIndex >= 0;
  }

  get isAllSelected(): boolean {
    for (const node of this._nodes) {
      if (!node.isSelected) {
        return false;
      }
    }
    return true;
  }

  get isSomeSelected(): boolean {
    const count = this.selectedCount;
    return count > 0 && count < this._nodes.length;
  }

  fromString(pathData: string) {
    const nodes: PathItem[] = [];
    const points: ControlPoint[] = [];

    let node: PathItem | undefined;

    // Split by command.
    const split = pathData.split(RE_COMMAND);
    const reader = new Reader();

    for (let i = 2; i < split.length; i += 2) {
      let command = split[i - 1];
      reader.data = split[i];

      while (true) {
        const name = command.toUpperCase() as DrawCommand;
        const params = reader.readAll(REXPS[name]);
        if (params !== null) {
          node = append(node, createPathNode(name, params)).tail;
          if (command.toLowerCase() === command) {
            translate(node, getX(node.prev), getY(node.prev));
            node.outputAsRelative = true;
          }
          nodes.push(node);
        } else {
          // console.warn('Couldn\'t properly parse this expression:', reader.data);
          break;
        }
        if (!reader.data || params.length === 0) {
          break;
        } else {
          if (command === 'M') {
            command = 'L';
          } else if (command === 'm') {
            command = 'l';
          }
        }
      }
    }

    for (const item of nodes) {
      if (hasControlPoint1(item)) {
        points.push(new Curve1ControlPoint(item));
      }
      if (hasControlPoint2(item)) {
        points.push(new Curve2ControlPoint(item));
      }
      if (!isClosePath(item)) {
        points.push(new MoveControlPoint(item));
      }
    }

    this._nodes = nodes;
    this._controlPoints = points;
  }

  toString(): string {
    return this._nodes.map(node => asString(node)).join('');
  }

  toFormattedString(separator?: string, maximumFractionDigits?: number): string {
    return this._nodes.map(node => asFormattedString(node, node.outputAsRelative, maximumFractionDigits)).join(separator || '');
  }

  outputAsRelative(relative: boolean) {
    for (const node of this._nodes) {
      node.outputAsRelative = relative;
    }
  }

  getCurveControlHandles() {
    const showAll = !this.hasSelection;
    return this._nodes
      .filter(node => (showAll || node.isSelected) && (isCurveTo(node) || isSmoothCurveTo(node) || isQCurveTo(node)))
      .map(getCurveControlHandles)
      .join('');
  }

  getReflectedControlHandles() {
    return this.getReflectedCurveTangentLines() + this.getReflectedEllipticalArcs();
  }

  getReflectedCurveTangentLines() {
    const showAll = !this.hasSelection;
    return this._nodes
      .filter(node => (showAll || node.isSelected) && (isSmoothCurveTo(node) || isSmoothQCurveTo(node)))
      .map(getReflectedCurveTangentLines)
      .join('');
  }

  getReflectedEllipticalArcs() {
    const showAll = !this.hasSelection;
    return this._nodes
      .filter(node => (showAll || node.isSelected) && isEllipticalArc(node))
      .map(getReflectedEllipticalArc)
      .join('');
  }

  select(index: number, value: boolean) {
    const node = this._nodes[index];
    if (node) {
      node.isSelected = value;
    }
  }

  selectAll(value: boolean) {
    for (const node of this._nodes) {
      node.isSelected = value;
    }
  }

  clearSelection() {
    this.selectAll(false);
  }

  getSelectedPath(): string {
    let path = '';
    for (const node of this._nodes) {
      if (node.isSelected) {
        path += `M${getX(node.prev)} ${getY(node.prev)}`;
        if (isSmoothCurveTo(node)) {
          path += asString({ ...node, name: 'C', x1: getReflectedX1(node), y1: getReflectedY1(node) });
        } else if (isSmoothQCurveTo(node)) {
          path += asString({ ...node, name: 'Q', x1: getReflectedX1(node), y1: getReflectedY1(node) });
        } else if (isClosePath(node) || isMoveTo(node)) {
          path += `L${getX(node)} ${getY(node)}`;
        } else {
          path += asString(node);
        }
      }
    }
    return path;
  }

  moveSelectedNodes(dx: number, dy: number) {
    for (const node of this._nodes) {
      if (node.isSelected) {
        translate(node, dx, dy);
      }
    }
  }

  getGroups(): PathItem[][]  {
    const groups: PathItem[][] = [];
    let next: PathItem[];
    for (const node of this._nodes) {
      if (!next || node.name === 'M') {
        if (next) {
          groups.push(next);
        }
        next = [node];
      } else {
        next.push(node);
      }
      if (node.name === 'Z') {
        groups.push(next);
        next = undefined;
      }
    }
    if (next) {
      groups.push(next);
    }
    return groups;
  }
}
