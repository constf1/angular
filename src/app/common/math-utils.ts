/**
 * Miscellaneous math utilities.
 */

export function toPercent(numerator: number, denominator: number = 100, fractionDigits: number = 3): string {
  return (numerator * 100 / denominator).toFixed(fractionDigits) + '%';
}
/**
 * Returns a random number between minValue (inclusive) and maxValue (exclusive)
 */
export function randomNumber(minValue: number, maxValue: number): number {
  return Math.random() * (maxValue - minValue) + minValue;
}
export function randomIneger(minValue: number, maxValue: number, skipValue?: number): number {
  if (skipValue !== undefined && maxValue - minValue >= 3) {
    // We need at least two numbers to choose from.
    while (true) {
      const value = randomIneger(minValue, maxValue);
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
