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

export function toPoint(x: number, y: number, offset: Point) {
  x += offset.x;
  y += offset.y;
  return { x, y };
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

  constructor(x: number, y: number, public prev?: MoveNode, relative?: boolean) {
    this._endPoint = toPoint(x, y, relative ? this.startPoint : ORIGIN);
  }

  get endPoint(): Point {
    return this._endPoint || ORIGIN;
  }

  get startPoint(): Point {
    return this.prev?.endPoint || ORIGIN;
  }

  paramsToString(offset: Point) {
    return toString(offset, this.endPoint);
  }

  /**
   * Returns an upper-case command with absolute coordinates.
   * @param convertToRelative If true returns a lower-case command with coordinates relative to the current position.
   */
  toString(convertToRelative?: boolean) {
    if (convertToRelative) {
      return this.command.toLowerCase() + this.paramsToString(this.startPoint);
    } else {
      return this.command + this.paramsToString(ORIGIN);
    }
  }
}

export class LineNode extends MoveNode {
  readonly command: string = 'L';
  constructor(x: number, y: number, prev?: MoveNode, relative?: boolean) {
    super(x, y, prev, relative);
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
  constructor(x: number, prev?: MoveNode, relative?: boolean) {
    super(x, 0, prev, relative);
    this._endPoint = new HLinePoint(this.endPoint.x, this);
  }

  paramsToString(offset: Point) {
    return ' ' + (this.endPoint.x - offset.x);
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
  constructor(y: number, prev?: MoveNode, relative?: boolean) {
    super(0, y, prev, relative);
    this._endPoint = new VLinePoint(this.endPoint.y, this);
  }

  paramsToString(offset: Point) {
    return ' ' + (this.endPoint.y - offset.y);
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
}

export class QCurveNode extends MoveNode {
  readonly command: string = 'Q';
  protected _controlPoint: Point;

  constructor(x1: number, y1: number, x: number, y: number, prev?: MoveNode, relative?: boolean) {
    super(x, y, prev, relative);
    this._controlPoint = toPoint(x1, y1, relative ? this.startPoint : ORIGIN);
  }

  get controlPoint() {
    return this._controlPoint;
  }

  paramsToString(offset: Point) {
    return toString(offset, this.controlPoint, this.endPoint);
  }
}

export class CurveNode extends QCurveNode {
  readonly command: string = 'C';
  protected _firstControlPoint: Point;
  constructor(
    x1: number, y1: number,
    x2: number, y2: number,
    x: number, y: number,
    prev?: MoveNode, relative?: boolean) {
    super(x2, y2, x, y, prev, relative);
    this._firstControlPoint = toPoint(x1, y1, relative ? this.startPoint : ORIGIN);
  }

  get firstControlPoint() {
    return this._firstControlPoint;
  }

  paramsToString(offset: Point) {
    return toString(offset, this.firstControlPoint, this.controlPoint, this.endPoint);
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
    prev?: MoveNode, relative?: boolean) {
    super(0, 0, x2, y2, x, y, prev, relative);
    this._firstControlPoint = new ReflectedControlPoint(this, 'C');
  }

  paramsToString(offset: Point) {
    return toString(offset, this.controlPoint, this.endPoint);
  }
}

export class SmoothQCurveNode extends QCurveNode {
  readonly command: string = 'T';
  constructor(
    x: number, y: number,
    prev?: MoveNode, relative?: boolean) {
    super(0, 0, x, y, prev, relative);
    this._controlPoint = new ReflectedControlPoint(this, 'Q');
  }

  paramsToString(offset: Point) {
    return toString(offset, this.endPoint);
  }
}

export class EllipticalArcNode extends MoveNode {
  readonly command: string = 'A';
  constructor(
    public rx: number, public ry: number,
    public angle: number,
    public largeArcFlag: boolean, public sweepFlag: boolean,
    x: number, y: number,
    prev?: MoveNode, relative?: boolean) {
    super(x, y, prev, relative);
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
}

const RE_COMMAND = /([MLHVZCSQTA])/gi;
const RE_FLAG = /[01]/;
const RE_SIGNED = /[+-]?(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/;
const RE_UNSIGNED = /(([0-9]+(\.[0-9]*)?)|\.[0-9]+)/;

interface NodeMaker {
  rexps: Readonly<RegExp[]>;
  build: (args: string[], prev?: MoveNode, isRelative?: boolean) => MoveNode;
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
    build: (args, prev?, isRelative?) => new MoveNode(+args[0], +args[1], prev, isRelative)
  },

  // Line To:
  // L x y
  // l dx dy
  L: {
    rexps: [RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) => new LineNode(+args[0], +args[1], prev, isRelative)
  },

  // Horizontal Line To:
  // H x
  // h dx
  H: {
    rexps: [RE_SIGNED],
    build: (args, prev?, isRelative?) => new HLineNode(+args[0], prev, isRelative)
  },

  // Vertical Line To:
  // V y
  // v dy
  V: {
    rexps: [RE_SIGNED],
    build: (args, prev?, isRelative?) => new VLineNode(+args[0], prev, isRelative)
  },

  // Close Path.
  Z: {
    rexps: [],
    build: (args, prev?, isRelative?) => new ClosePathNode(prev)
  },

  // Bézier curves:

  // Curve To:
  // C x1 y1, x2 y2, x y
  // c dx1 dy1, dx2 dy2, dx dy
  C: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) => new CurveNode(+args[0], +args[1], +args[2], +args[3], +args[4], +args[5], prev, isRelative)
  },

  // Shortcut Curve To:
  // S x2 y2, x y
  // s dx2 dy2, dx dy
  S: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) => new SmoothCurveNode(+args[0], +args[1], +args[2], +args[3], prev, isRelative)
  },

  // Quadratic Curve To:
  // Q x1 y1, x y
  // q dx1 dy1, dx dy
  Q: {
    rexps: [RE_SIGNED, RE_SIGNED, RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) => new QCurveNode(+args[0], +args[1], +args[2], +args[3], prev, isRelative)
  },

  // Shortcut Quadratic Curve To:
  // T x y
  // t dx dy
  T: {
    rexps: [RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) => new SmoothQCurveNode(+args[0], +args[1], prev, isRelative)
  },


  // Arc To:
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
  A: {
    rexps: [RE_UNSIGNED, RE_UNSIGNED, RE_SIGNED, RE_FLAG, RE_FLAG, RE_SIGNED, RE_SIGNED],
    build: (args, prev?, isRelative?) =>
      new EllipticalArcNode(+args[0], +args[1], +args[2], args[3] === '1', args[4] === '1', +args[5], +args[6], prev, isRelative)
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

  constructor(data: string = '') {
    this.data = data;
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

export class PathModel {
  nodes: MoveNode[] = [];
  points: Point[] = [];

  fromString(path: string) {
    let nodeCount = 0;
    const nodes = this.nodes;
    // Split by command.
    const split = path.split(RE_COMMAND);

    for (let i = 1; i + 1 < split.length; i += 2) {
      let command = split[i];
      const reader = new Reader(split[i + 1]);
      while (true) {
        const maker = NODE_MAKER[command.toUpperCase()];
        const params = reader.readAll(maker.rexps);
        if (params !== null) {
          nodes[nodeCount] = maker.build(params, nodes[nodeCount - 1], command.toLowerCase() === command);
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

    this.updateControlPoints();
  }

  toString(convertToRelative?: boolean, separator?: string) {
    return this.nodes.map(node => node.toString(convertToRelative)).join(separator || '');
  }

  updateControlPoints() {
    this.points.length = 0;

    for (const node of this.nodes) {
      // ClosePath has no controllable moveTo point.
      if (!(node instanceof ClosePathNode)) {
        this.points.push(node.endPoint);

        if (node instanceof QCurveNode) {
          if (node instanceof CurveNode) {
            const p1 = node.firstControlPoint;
            if (!(p1 instanceof ReflectedControlPoint)) {
              this.points.push(p1);
            }
          }

          const pc = node.controlPoint;
          if (!(pc instanceof ReflectedControlPoint)) {
            this.points.push(pc);
          }
        }
      }
    }
  }

  getControlHandles() {
    let path = '';
    for (const node of this.nodes) {
      if (node instanceof CurveNode) {
        const p0 = node.startPoint;
        const p1 = node.firstControlPoint;
        const p2 = node.controlPoint;
        const p = node.endPoint;

        if (!(p1 instanceof ReflectedControlPoint)) {
          path += `M${p0.x} ${p0.y}L${p1.x} ${p1.y}`;
        }
        path += `M${p2.x} ${p2.y}L${p.x} ${p.y}`;
      } else if (node instanceof QCurveNode) {
        const p0 = node.startPoint;
        const p1 = node.controlPoint;
        const p = node.endPoint;
        if (!(p1 instanceof ReflectedControlPoint)) {
          path += `M${p0.x} ${p0.y}L${p1.x} ${p1.y}L${p.x} ${p.y}`;
        }
      }
    }
    return path;
  }

  getReflectedControlHandles() {
    let path = '';
    for (const node of this.nodes) {
      if (node instanceof SmoothCurveNode) {
        const p0 = node.startPoint;
        const p1 = node.firstControlPoint;
        path += `M${p0.x} ${p0.y}L${p1.x} ${p1.y}`;
      } else if (node instanceof SmoothQCurveNode) {
        const p0 = node.startPoint;
        const p1 = node.controlPoint;
        const p = node.endPoint;
        path += `M${p0.x} ${p0.y}L${p1.x} ${p1.y}L${p.x} ${p.y}`;
      } else if (node instanceof EllipticalArcNode) {
        const p0 = node.startPoint;
        const p1 = node.centerPoint;
        const p = node.endPoint;
        path += `M${p.x} ${p.y}L${p1.x} ${p1.y}L${p0.x} ${p0.y}A${node.paramsToString(ORIGIN, true)}`;
      }
    }
    return path;
  }
}
