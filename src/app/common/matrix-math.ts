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
  return m.a === 1
      && m.b === 0
      && m.c === 0
      && m.d === 1
      && m.e === 0
      && m.f === 0;
}

export function isTranslate(m: ReadonlyMatrix): boolean {
  return m.a === 1
      && m.d === 1
      && m.b === 0
      && m.c === 0;
}

export function isScale(m: ReadonlyMatrix): boolean {
  return m.e === 0
      && m.f === 0
      && m.b === 0
      && m.c === 0;
}

export function createIdentity(): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

export function createTranslate(x: number, y: number): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
}

export function createScale(scaleX: number, scaleY: number): Matrix {
  return { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 };
}

export function createSkew(skewX: number, skewY: number): Matrix {
  return { a: 1, b: Math.tan(skewY), c: Math.tan(skewX), d: 1, e: 0, f: 0 };
}

export function createRotate(angle: number): Matrix {
  return { a: Math.cos(angle), b: Math.sin(angle), c: -Math.sin(angle), d: Math.cos(angle), e: 0, f: 0 };
}

export function multiply(A: ReadonlyMatrix, B: ReadonlyMatrix): Matrix {
  return {
    a: A.a * B.a + A.c * B.b,
    b: A.b * B.a + A.d * B.b,
    c: A.a * B.c + A.c * B.d,
    d: A.b * B.c + A.d * B.d,
    e: A.a * B.e + A.c * B.f + A.e,
    f: A.b * B.e + A.d * B.f + A.f,
  };
}

// from http://math.stackexchange.com/questions/861674/decompose-a-2d-arbitrary-transform-into-only-scaling-and-rotation
export function decompose(m: ReadonlyMatrix) {
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
    rotate: -phi * 180 / Math.PI,
    scaleX: Q + R,
    scaleY: Q - R,
    skew: -theta * 180 / Math.PI
  };
}