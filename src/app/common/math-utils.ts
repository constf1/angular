import { padLeft } from './string-utils';

/**
 * Miscellaneous math utilities.
 */
export function overlap(min1: number, max1: number, min2: number, max2: number): number {
  return Math.min(max1, max2) - Math.max(min1, min2);
}

type Rect = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;

export function overlapArea(rc1: Rect, rc2: Rect): number {
  let sq = overlap(rc1.left, rc1.right, rc2.left, rc2.right);
  if (sq > 0) {
    sq *= overlap(rc1.top, rc1.bottom, rc2.top, rc2.bottom);
  }
  return sq > 0 ? sq : 0;
}

export function toPercent(numerator: number, denominator: number = 100, fractionDigits: number = 3): string {
  return (numerator * 100 / denominator).toFixed(fractionDigits) + '%';
}

export function toString(value: number, minWidth: number, prefix: string = '0', radix?: number): string {
  return padLeft(value.toString(radix), minWidth, prefix);
}

/**
 * Returns a string representing a number in fixed-point notation.
 * @param value The number.
 * @param maximumFractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
 */
export function formatDecimal(value: number, maximumFractionDigits?: number): string {
  const str = value.toFixed(maximumFractionDigits);
  if (/\.\d*$/.test(str)) {
    let length = str.length;
    while (true) {
      if (str.endsWith('0', length)) {
        length--;
      } else {
        if (str.endsWith('.', length)) {
          length--;
        }
        break;
      }
    }
    if (length < str.length) {
      return str.substring(0, length);
    }
  }
  return str;
}

/**
 * Returns a random number between minValue (inclusive) and maxValue (exclusive)
 */
export function randomNumber(minValue: number, maxValue: number): number {
  return Math.random() * (maxValue - minValue) + minValue;
}
export function randomInteger(minValue: number, maxValue: number, skipValue?: number): number {
  if (skipValue !== undefined && maxValue - minValue >= 3) {
    // We need at least two numbers to choose from.
    while (true) {
      const value = randomInteger(minValue, maxValue);
      if (value !== skipValue) {
        return value;
      }
    }
  }
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

const CODE_0 = '0'.charCodeAt(0);
const CODE_A = 'a'.charCodeAt(0);

export function byteToCode(n: number): number {
  if (n >= 0 && n < 10) {
    return CODE_0 + n;
  } else {
    return CODE_A + n - 10;
  }
}

export function codeToByte(code: number): number {
  if (code >= CODE_A) {
    return 10 + code - CODE_A;
  } else {
    return code - CODE_0;
  }
}

export function byteArrayToString(arr: number[]): string {
  const codes = arr.map(n => byteToCode(n));
  return String.fromCharCode(...codes);
}

export function byteAt(str: string, index: number): number {
  return codeToByte(str.charCodeAt(index));
}

export function stringToByteArray(str: string): number[] {
  const arr: number[] = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(codeToByte(str.charCodeAt(i)));
  }
  return arr;
}

/**
 * Linear interpolation.
 * @param a start point
 * @param b stop point
 * @param t blend factor in the interval [0, 1]
 */
export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}


export function clamp(a: number, b: number, c: number): number {
  return Math.min(Math.max(a, b), c);
}

/**
 * Quadratic Bezier Curve
 */
export function bezier2(p0: number, p1: number, p2: number, t: number): number {
  // p(t) = (1-t)^2 * p0 + 2 * (1-t) * t * p1 + t^2 * p2
  const s = 1 - t;
  return s * s * p0 + 2 * s * t * p1 + t * t * p2;
}

/**
 * Cubic Bezier Curve
 */
export function bezier3(p0: number, p1: number, p2: number, p3: number, t: number): number {
  // p(t) = (1-t)^3 * p0 + 3 * (1-t)^2 * t * p1 + 3 * (1-t) * t^2 * p2 + t^3 * p3
  const s = 1 - t;
  return s * s * s * p0 + 3 * s * s * t * p1 + 3 * s * t * t * p2 + t * t * t * p3;
}

/**
 * Tests if the number is near to 0.
 * @param a the number
 */
export function isZero(a: number): boolean {
  return Math.abs(a) <= Number.EPSILON;
}

/**
 * Tests if the two numbers are near to each other.
 * @param a first number
 * @param b second number
 */
export function isNear(a: number, b: number): boolean {
  return Math.abs(a - b) <= Number.EPSILON;
}
