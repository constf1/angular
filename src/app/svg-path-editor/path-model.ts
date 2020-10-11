// tslint:disable: variable-name

export interface Point {
  x: number;
  y: number;
}

// The readonly origin of a Cartesian coordinate system.
export const ORIGIN: Point = {
  get x() { return 0; }, set x(value: number) {},
  get y() { return 0; }, set y(value: number) {}
};

function translate(point: Point, offset: Point) {
  point.x += offset.x;
  point.y += offset.y;
}

function toString(offset: Point, ...points: Point[]) {
  let buf = '';
  for (const point of points) {
    buf += ` ${point.x - offset.x} ${point.y - offset.y}`;
  }
  return buf;
}

/**
 * All SVG path nodes are defined in terms of start and end points on the curve.
 * One of the advantages of end-point parameterization is that it permits a consistent path syntax
 * in which all path commands end in the coordinates of the new "current point".
 */
export class MoveNode {
  readonly command: string = 'M';
  protected _endPoint: Point;

  constructor(x: number, y: number, public prev?: MoveNode) {
    this._endPoint = { x, y };
  }

  get endPoint(): Point {
    return this._endPoint;
  }

  get startPoint(): Point {
    return this.prev?._endPoint || ORIGIN;
  }

  getControlPoints(arr: Point[]) {
    arr.push(this._endPoint);
  }

  paramsToString(offset: Point) {
    return toString(offset, this._endPoint);
  }

  translate(offset: Point) {
    translate(this._endPoint, offset);
  }

  /**
   * Returns an upper-case command with absolute coordinates.
   * @param convertToRelative If true returns a lower-case command with coordinates relative to the current position.
   */
  toString(convertToRelative?: boolean): string {
    return (convertToRelative
     ? (this.command.toLowerCase() + this.paramsToString(this.startPoint))
     : (this.command + this.paramsToString(ORIGIN)));
  }
}

export class LineNode extends MoveNode {
  readonly command: string = 'L';
  constructor(x: number, y: number, prev?: MoveNode) {
    super(x, y, prev);
  }
}

export class HLinePoint implements Point {
  constructor(public x: number, private _node: MoveNode) {}

  get y() {
    return this._node.startPoint.y;
  }

  set y(value: number) {}
}

export class HLineNode extends MoveNode {
  readonly command: string = 'H';
  constructor(x: number, prev?: MoveNode) {
    super(x, 0, prev);
    this._endPoint = new HLinePoint(this._endPoint.x, this);
  }

  paramsToString(offset: Point) {
    return ' ' + (this._endPoint.x - offset.x);
  }
}

export class VLinePoint implements Point {
  constructor(public y: number, private _node: MoveNode) {}

  get x() {
    return this._node.startPoint.x;
  }

  set x(value: number) {}
}

export class VLineNode extends MoveNode {
  readonly command: string = 'V';
  constructor(y: number, prev?: MoveNode) {
    super(0, y, prev);
    this._endPoint = new VLinePoint(this._endPoint.y, this);
  }

  paramsToString(offset: Point) {
    return ' ' + (this._endPoint.y - offset.y);
  }
}

export class ClosePathPoint implements Point {
  constructor(private _node: MoveNode) {}

  get startPoint(): Point {
    for (let node = this._node.prev; node; node = node.prev) {
      if (node.command === 'M') {
        return node.endPoint;
      }
    }
    return ORIGIN;
  }

  get x() {
    return this.startPoint.x;
  }

  set x(value: number) {}

  get y() {
    return this.startPoint.y;
  }

  set y(value: number) {}
}

export class ClosePathNode extends MoveNode {
  readonly command: string = 'Z';
  constructor(prev?: MoveNode) {
    super(0, 0, prev);
    this._endPoint = new ClosePathPoint(this);
  }

  paramsToString(offset: Point) {
    return ' ';
  }

  getControlPoints(arr: Point[]) {
    // ClosePath has no controllable moveTo point.
  }
}

export class QCurveNode extends MoveNode {
  readonly command: string = 'Q';
  protected _controlPoint: Point;

  constructor(x1: number, y1: number, x: number, y: number, prev?: MoveNode) {
    super(x, y, prev);
    this._controlPoint = { x: x1, y: y1 };
  }

  get controlPoint() {
    return this._controlPoint;
  }

  translate(offset: Point) {
    translate(this._endPoint, offset);
    translate(this._controlPoint, offset);
  }

  paramsToString(offset: Point) {
    return toString(offset, this._controlPoint, this._endPoint);
  }

  getControlPoints(arr: Point[]) {
    arr.push(this._controlPoint, this._endPoint);
  }

  getControlHandles(): string {
    const p0 = this.startPoint;
    const p1 = this.controlPoint;
    const p = this.endPoint;
    return `M${p0.x} ${p0.y}L${p1.x} ${p1.y}L${p.x} ${p.y}`;
  }
}

export class CurveNode extends QCurveNode {
  readonly command: string = 'C';
  protected _firstControlPoint: Point;
  constructor(
    x1: number, y1: number,
    x2: number, y2: number,
    x: number, y: number,
    prev?: MoveNode) {
    super(x2, y2, x, y, prev);
    this._firstControlPoint = { x: x1, y: y1 };
  }

  get firstControlPoint() {
    return this._firstControlPoint;
  }

  translate(offset: Point) {
    translate(this._endPoint, offset);
    translate(this._controlPoint, offset);
    translate(this._firstControlPoint, offset);
  }

  paramsToString(offset: Point) {
    return toString(offset, this._firstControlPoint, this._controlPoint, this._endPoint);
  }

  getControlPoints(arr: Point[]) {
    arr.push(this._firstControlPoint, this._controlPoint, this._endPoint);
  }

  getControlHandles(): string {
    const p0 = this.startPoint;
    const p1 = this.firstControlPoint;
    const p2 = this.controlPoint;
    const p = this.endPoint;
    return `M${p0.x} ${p0.y}L${p1.x} ${p1.y}M${p2.x} ${p2.y}L${p.x} ${p.y}`;
  }
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
export class ReflectedControlPoint implements Point {
  constructor(private _node: MoveNode, readonly command: string) {}

  get x() {
    // If the previous command wasn't a cubic/quadratic Bézier curve,
    // the start control point is the same as the curve starting point (current point).
    const node = this._node;
    let x = node.startPoint.x;
    if (node.prev instanceof QCurveNode && (node.prev.command === node.command || node.prev.command === this.command)) {
      // The control point is a reflection of the control point of the previous curve command.
      x += x - node.prev.controlPoint.x;
    }
    return x;
  }

  set x(value: number) {}

  get y() {
    const node = this._node;
    let y = node.startPoint.y;
    if (node.prev instanceof QCurveNode && (node.prev.command === node.command || node.prev.command === this.command)) {
      y += y - node.prev.controlPoint.y;
    }
    return y;
  }

  set y(value: number) {}
}

export class SmoothCurveNode extends CurveNode {
  readonly command: string = 'S';
  constructor(
    x2: number, y2: number,
    x: number, y: number,
    prev?: MoveNode) {
    super(0, 0, x2, y2, x, y, prev);
    this._firstControlPoint = new ReflectedControlPoint(this, 'C');
  }

  paramsToString(offset: Point) {
    return toString(offset, this._controlPoint, this._endPoint);
  }

  getControlPoints(arr: Point[]) {
    arr.push(this._controlPoint, this._endPoint);
  }

  getControlHandles(): string {
    const p2 = this.controlPoint;
    const p = this.endPoint;
    return `M${p2.x} ${p2.y}L${p.x} ${p.y}`;
  }

  getReflectedControlHandles(): string {
    const p0 = this.startPoint;
    const p1 = this.firstControlPoint;
    return `M${p0.x} ${p0.y}L${p1.x} ${p1.y}`;
  }
}

export class SmoothQCurveNode extends QCurveNode {
  readonly command: string = 'T';
  constructor(x: number, y: number, prev?: MoveNode) {
    super(0, 0, x, y, prev);
    this._controlPoint = new ReflectedControlPoint(this, 'Q');
  }

  paramsToString(offset: Point) {
    return toString(offset, this._endPoint);
  }

  getControlPoints(arr: Point[]) {
    arr.push(this._endPoint);
  }

  getControlHandles(): string {
    return '';
  }

  getReflectedControlHandles(): string {
    const p0 = this.startPoint;
    const p1 = this.controlPoint;
    const p = this.endPoint;
    return `M${p0.x} ${p0.y}L${p1.x} ${p1.y}L${p.x} ${p.y}`;
  }
}

export class EllipticalArcNode extends MoveNode {
  readonly command: string = 'A';
  constructor(
    public rx: number, public ry: number,
    public angle: number,
    public largeArcFlag: boolean, public sweepFlag: boolean,
    x: number, y: number,
    prev?: MoveNode) {
    super(x, y, prev);
  }

  // Specification: https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
  get centerPoint(): Point {
    // Given the following variables:
    // x1 y1 x2 y2 fA fS rx ry phi
    const p1 = this.startPoint;
    const p2 = this.endPoint;

    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    const fA = this.largeArcFlag;
    const fB = this.sweepFlag;

    // Correction Step 1: Ensure radii are positive
    let rx = Math.abs(this.rx);
    let ry = Math.abs(this.ry);
    // Correction Step 2: Ensure radii are non-zero
    // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop.
    if (rx === 0 || ry === 0) {
      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    }

    // Step 1: Compute (x1′, y1′)
    const phi = this.angle * Math.PI / 180;
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

  paramsToString(offset: Point, toggleFlags?: boolean) {
    const fA = (!toggleFlags === this.largeArcFlag) ? '1' : '0';
    const fB = (!toggleFlags === this.sweepFlag) ? '1' : '0';
    return ` ${this.rx} ${this.ry} ${this.angle} ` + fA + fB + toString(offset, this.endPoint);
  }

  getReflectedControlHandles(): string {
    const p0 = this.startPoint;
    const p1 = this.centerPoint;
    const p = this.endPoint;

    const sa = `M${p.x} ${p.y}L${p1.x} ${p1.y}L${p0.x} ${p0.y}A${this.paramsToString(ORIGIN, true)}`;

    const a = this.angle * Math.PI / 180;
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);

    let dx = cosA * this.rx;
    let dy = sinA * this.rx;
    const sb = `M${p1.x - dx} ${p1.y - dy}l${2 * dx} ${2 * dy}`;

    dx = -sinA * this.ry;
    dy = cosA * this.ry;
    const sc = `M${p1.x - dx} ${p1.y - dy}l${2 * dx} ${2 * dy}`;

    return sa + sb + sc;
  }
}

const RE_COMMAND = /([MLHVZCSQTA])/gi;
const RE_FLAG = /[01]/;
const RE_SIGNED = /[+-]?(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/;
const RE_UNSIGNED = /(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/;

interface NodeMaker {
  rexps: Readonly<RegExp[]>;
  build: (args: string[], prev?: MoveNode) => MoveNode;
}

/**
 * [Path Doc](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
 */
const NODE_MAKER: {[key: string]: NodeMaker} = {
  // Move To:
  //  M x y
  //  m dx dy
  M: {
    rexps: [RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new MoveNode(+args[0], +args[1], prev)
  },

  // Line To:
  // L x y
  // l dx dy
  L: {
    rexps: [RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new LineNode(+args[0], +args[1], prev)
  },

  // Horizontal Line To:
  // H x
  // h dx
  H: {
    rexps: [RE_SIGNED],
    build: (args, prev?) => new HLineNode(+args[0], prev)
  },

  // Vertical Line To:
  // V y
  // v dy
  V: {
    rexps: [RE_SIGNED],
    build: (args, prev?) => new VLineNode(+args[0], prev)
  },

  // Close Path.
  Z: {
    rexps: [],
    build: (args, prev?) => new ClosePathNode(prev)
  },

  // Bézier curves:

  // Curve To:
  // C x1 y1, x2 y2, x y
  // c dx1 dy1, dx2 dy2, dx dy
  C: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new CurveNode(+args[0], +args[1], +args[2], +args[3], +args[4], +args[5], prev)
  },

  // Shortcut Curve To:
  // S x2 y2, x y
  // s dx2 dy2, dx dy
  S: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new SmoothCurveNode(+args[0], +args[1], +args[2], +args[3], prev)
  },

  // Quadratic Curve To:
  // Q x1 y1, x y
  // q dx1 dy1, dx dy
  Q: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new QCurveNode(+args[0], +args[1], +args[2], +args[3], prev)
  },

  // Shortcut Quadratic Curve To:
  // T x y
  // t dx dy
  T: {
    rexps: [RE_SIGNED, RE_SIGNED],
    build: (args, prev?) => new SmoothQCurveNode(+args[0], +args[1], prev)
  },


  // Arc To:
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
  A: {
    rexps: [RE_UNSIGNED, RE_UNSIGNED, RE_SIGNED, RE_FLAG, RE_FLAG, RE_SIGNED, RE_SIGNED],
    build: (args, prev?) =>
      new EllipticalArcNode(+args[0], +args[1], +args[2], args[3] === '1', args[4] === '1', +args[5], +args[6], prev)
  }
};

/**
 * Helper class.
 */

class Reader {
  private _data: string;

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

export interface PathNode extends MoveNode {
  isRelative?: boolean;
  isSelected?: boolean;
}

export class PathModel {
  private _nodes: PathNode[] = [];
  private _points: Point[] = [];

  get selectedCount() {
    let count = 0;
    for (const node of this._nodes) {
      if (node.isSelected) {
        count++;
      }
    }
    return count;
  }

  get firstSelection(): MoveNode | undefined {
    for (const node of this._nodes) {
      if (node.isSelected) {
        return node;
      }
    }
  }

  get hasSelection(): boolean {
    return !!this.firstSelection;
  }

  fromString(path: string) {
    let nodeCount = 0;
    const nodes = this._nodes;
    // Split by command.
    const split = path.split(RE_COMMAND);
    const reader = new Reader();

    for (let i = 2; i < split.length; i += 2) {
      let command = split[i - 1];
      reader.data = split[i];

      while (true) {
        const maker = NODE_MAKER[command.toUpperCase()];
        const params = reader.readAll(maker.rexps);
        if (params !== null) {
          const node: PathNode = maker.build(params, nodes[nodeCount - 1]);
          if (command.toLowerCase() === command) {
            node.isRelative = true;
            node.translate(node.startPoint);
          }
          nodes[nodeCount] = node;
          nodeCount++;
        } else {
          // console.warn('Couldn\'t properly parse this expression:', s[i], s[i + 1], reader.data);
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
    nodes.length = nodeCount;

    this.updateControls();
  }

  convertTo(relative: boolean) {
    for (const node of this._nodes) {
      node.isRelative = relative;
    }
  }

  toAbsolutePath() {
    return this._nodes.map(node => node.toString()).join('');
  }

  toRelativePath() {
    return this._nodes.map(node => node.toString(true)).join('');
  }

  toString(separator?: string) {
    return this._nodes.map(node => node.toString(node.isRelative)).join(separator || '');
  }

  updateControls() {
    this._points.length = 0;

    for (const node of this._nodes) {
      node.getControlPoints(this._points);
    }
  }

  getControlPoints(): Point[] {
    const node = this.firstSelection;
    if (node) {
      const arr: Point[] = [];
      node.getControlPoints(arr);
      return arr;
    } else {
      return this._points;
    }
  }

  getControlHandles() {
    const showAll = !this.hasSelection;
    let path = '';
    for (const node of this._nodes) {
      if (showAll || node.isSelected) {
        if (node instanceof QCurveNode) {
          path += node.getControlHandles();
        }
      }
    }
    return path;
  }

  getReflectedControlHandles() {
    const showAll = !this.hasSelection;
    let path = '';
    for (const node of this._nodes) {
      if (showAll || node.isSelected) {
        if (node instanceof SmoothCurveNode || node instanceof SmoothQCurveNode || node instanceof EllipticalArcNode) {
          path += node.getReflectedControlHandles();
        }
      }
    }
    return path;
  }

  select(index: number, value: boolean) {
    const node = this._nodes[index];
    if (node) {
      node.isSelected = value;
    }
  }

  clearSelection() {
    for (const node of this._nodes) {
      node.isSelected = false;
    }
  }

  getSelectedPath() {
    let path = '';
    for (const node of this._nodes) {
      if (node.isSelected) {
        const p0 = node.startPoint;
        const p1 = node.endPoint;
        if (node instanceof QCurveNode) {
          const c1 = node.controlPoint;
          if (node instanceof CurveNode) {
            const c0 = node.firstControlPoint;
            path += `M${p0.x} ${p0.y}C${c0.x} ${c0.y} ${c1.x} ${c1.y} ${p1.x} ${p1.y}`;
          } else {
            path += `M${p0.x} ${p0.y}Q${c1.x} ${c1.y} ${p1.x} ${p1.y}`;
          }
        } else if (node instanceof EllipticalArcNode) {
          path += `M${p0.x} ${p0.y}` + node.toString();
        } else {
          path += `M${p0.x} ${p0.y}L${p1.x} ${p1.y}`;
        }
      }
    }
    return path;
  }

  moveSelectedNodes(offset: Point) {
    for (const node of this._nodes) {
      if (node.isSelected) {
        node.translate(offset);
      }
    }
  }

  getGroups(): PathNode[][]  {
    const groups: PathNode[][] = [];
    let next: PathNode[];
    for (const node of this._nodes) {
      if (!next || node.command === 'M') {
        if (next) {
          groups.push(next);
        }
        next = [node];
      } else {
        next.push(node);
      }
      if (node.command === 'Z') {
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
