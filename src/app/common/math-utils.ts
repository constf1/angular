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
