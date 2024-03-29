import { isNear, isZero } from './math-utils';

/**
 * A 2D 3x2 matrix with six parameters a, b, c, d, e and f.
 * It is equivalent to applying the 3x3 transformation matrix:
 * <pre>
 * | x1 |   | a c e |   | x |
 * | y1 | = | b d f | * | y |
 * |  1 |   | 0 0 1 |   | 1 |
 * </pre>
 * http://www.w3.org/TR/css3-transforms/#recomposing-to-a-2d-matrix
 */
export interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export type ReadonlyMatrix = Readonly<Matrix>;

export function isIdentity(m: ReadonlyMatrix): boolean {
  return m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0;
}

export function isValid(m: ReadonlyMatrix): boolean {
  const check = Number.isFinite || ((value) => (typeof value === 'number' && isFinite(value)));
  return check(m.a) && check(m.b) && check(m.c) && check(m.d) && check(m.e) && check(m.f);
}

export function isTranslate(m: ReadonlyMatrix): boolean {
  return m.a === 1 && m.d === 1 && m.b === 0 && m.c === 0;
}

export function isScale(m: ReadonlyMatrix): boolean {
  return m.e === 0 && m.f === 0 && m.b === 0 && m.c === 0;
}

export function createIdentity(): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

export function createTranslate(x: number, y: number): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
}

/**
 * Creates a scale matrix.
 *
 * @param scaleX The amount by which to scale along the x-axis.
 * @param scaleY The amount by which to scale along the y-axis.
 */
export function createScale(scaleX: number, scaleY: number): Matrix {
  return { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 };
}

/**
 * Creates a scale about the specified point matrix.
 *
 * @param scaleX The amount by which to scale along the x-axis.
 * @param scaleY The amount by which to scale along the y-axis.
 * @param centerX The x-coordinate of the scale operation's center point.
 * @param centerY The y-coordinate of the scale operation's center point.
 */
export function createScaleAt(scaleX: number, scaleY: number, centerX: number, centerY: number): Matrix {
  // Analog of:
  // SVG.transform="translate(cx, cy) scale(sx, sy) translate(-cx, -cy)"
  // or
  // multiply(
  //   createTranslate(centerX, centerY),
  //   multiply(createScale(scaleX, scaleY), createTranslate(-centerX, -centerY))
  // );
  return { a: scaleX, b: 0, c: 0, d: scaleY, e: centerX * (1 - scaleX), f: centerY * (1 - scaleY) };
}

/**
 * Creates a skew of the specified degrees in the x and y dimensions matrix.
 *
 * @param skewX The angle in the x dimension by which to skew.
 * @param skewY The angle in the y dimension by which to skew.
 */
export function createSkew(skewX: number, skewY: number): Matrix {
  return { a: 1, b: Math.tan(skewY), c: Math.tan(skewX), d: 1, e: 0, f: 0 };
}

/**
 * Creates a skew about the specified point matrix.
 *
 * @param skewX The angle in the x dimension by which to skew.
 * @param skewY The angle in the y dimension by which to skew.
 * @param centerX The x-coordinate of the skew operation's center point.
 * @param centerY The x-coordinate of the skew operation's center point.
 */
export function createSkewAt(skewX: number, skewY: number, centerX: number, centerY: number): Matrix {
  // Analog of:
  // multiply(
  //   createTranslate(centerX, centerY),
  //   multiply(createSkew(skewX, skewY), createTranslate(-centerX, -centerY))
  // );
  const b = Math.tan(skewY);
  const c = Math.tan(skewX);
  return { a: 1, b, c, d: 1, e: -c * centerY, f: -b * centerX };
}

/**
 * Creates a rotation matrix.
 *
 * @param angle The rotation angle, in radians.
 */
export function createRotate(angle: number): Matrix {
  return { a: Math.cos(angle), b: Math.sin(angle), c: -Math.sin(angle), d: Math.cos(angle), e: 0, f: 0 };
}

/**
 * Creates a rotation matrix about the specified point.
 *
 * @param angle The angle, in radians, by which to rotate.
 * @param centerX The x-coordinate of the point about which to rotate.
 * @param centerY The y-coordinate of the point about which to rotate.
 */
export function createRotateAt(angle: number, centerX: number, centerY: number): Matrix {
  // Analog of:
  // SVG.transform="translate(cx, cy) rotate(deg) translate(-cx, -cy)"
  // or
  // multiply(
  //   createTranslate(centerX, centerY),
  //   multiply(createRotate(angle), createTranslate(-centerX, -centerY))
  // );
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  return { a, b, c: -b, d: a, e: (1 - a) * centerX + b * centerY, f: (1 - a) * centerY - b * centerX };
}

export function multiply(ma: ReadonlyMatrix, mb: ReadonlyMatrix): Matrix {
  return {
    a: ma.a * mb.a + ma.c * mb.b,
    b: ma.b * mb.a + ma.d * mb.b,
    c: ma.a * mb.c + ma.c * mb.d,
    d: ma.b * mb.c + ma.d * mb.d,
    e: ma.a * mb.e + ma.c * mb.f + ma.e,
    f: ma.b * mb.e + ma.d * mb.f + ma.f,
  };
}

/**
 * Returns an inverted version of the matrix.
 *
 * @param m the given matrix
 */
export function invert(m: ReadonlyMatrix): Matrix {
  const x = m.a * m.d - m.b * m.c;
  return {
    a: m.d / x,
    b: -m.b / x,
    c: -m.c / x,
    d: m.a / x,
    e: (m.c * m.f - m.d * m.e) / x,
    f: (m.b * m.e - m.a * m.f) / x,
  };
}

export function toArray(m: ReadonlyMatrix): number[] {
  return [m.a, m.b, m.c, m.d, m.e, m.f];
}

export function toString(m: ReadonlyMatrix): string {
  return 'matrix(' + toArray(m).join(', ') + ')';
}

// from http://math.stackexchange.com/questions/861674/decompose-a-2d-arbitrary-transform-into-only-scaling-and-rotation
export function decompose(
  m: ReadonlyMatrix
): {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skew: number;
} {
  const E = (m.a + m.d) / 2;
  const F = (m.a - m.d) / 2;
  const G = (m.c + m.b) / 2;
  const H = (m.c - m.b) / 2;

  const Q = Math.sqrt(E * E + H * H);
  const R = Math.sqrt(F * F + G * G);
  const a1 = Math.atan2(G, F);
  const a2 = Math.atan2(H, E);
  const theta = (a2 - a1) / 2;
  const phi = (a2 + a1) / 2;

  return {
    translateX: m.e,
    translateY: m.f,
    rotate: (-phi * 180) / Math.PI,
    scaleX: Q + R,
    scaleY: Q - R,
    skew: (-theta * 180) / Math.PI,
  };
}

/**
 * Gets the point (if any exists) around which a transformation is applied.
 *
 * @param m Transformation matrix.
 */
export function getTransformOrigin(m: ReadonlyMatrix): { x?: number; y?: number } | undefined {
  const { b, c, e, f } = m;
  // a * x + c * y + e = x
  // b * x + d * y + f = y
  // =>
  // (a - 1) * x + c * y + e = 0
  // b * x + (d - 1) * y + f = 0
  // or
  // a * x + c * y + e = 0
  // b * x + d * y + f = 0
  // where a = a0 - 1 and d = d0 - 1

  const a = m.a - 1;
  const d = m.d - 1;
  const det = (b * c - a * d);
  if (!isZero(det)) {
    const x = (d * e - c * f) / (b * c - a * d);
    const y = (a * f - b * e) / (b * c - a * d);
    return { x, y };
  } else {
    // b * c - a * d = 0
    if (isZero(a) && isZero(b)) {
      // c * y + e = 0
      // d * y + f = 0
      if (isZero(c)) {
        if (!isZero(d)) {
          return { x: NaN, y: -f / d };
        }
      } else if (isZero(d)) {
        if (!isZero(c)) {
          return { x: NaN, y: -e / c };
        }
      } else {
        const y1 = -e / c;
        const y2 = -f / d;
        if (isNear(y1, y2)) {
          return { x: NaN, y: y1 };
        }
      }
    }

    if (isZero(c) && isZero(d)) {
      // a * x + e = 0
      // b * x + f = 0
      if (isZero(a)) {
        if (!isZero(b)) {
          return { x: -f / b, y: NaN };
        }
      } else if (isZero(b)) {
        if (!isZero(a)) {
          return { x: -e / a, y: NaN };
        }
      } else {
        const x1 = -e / a;
        const x2 = -f / b;
        if (isNear(x1, x2)) {
          return { x: x1, y: NaN };
        }
      }
    }
  }

  return undefined;
}
