/**
 * Miscellaneous array utilities.
 */

export function clear<T>(arr: T[][]) {
  for (const a of arr) {
    a.length = 0;
  }
}

export function copy<T>(arr: Readonly<Readonly<T[]>[]>) {
  const buf: T[][] = [];
  for (const a of arr) {
    buf.push([...a]);
  }
  return buf;
}

export function endsWith<T>(buffer: Readonly<T[]>, values: Readonly<T[]>): boolean {
  const vl = values.length;
  const dl = buffer.length - vl;
  if (dl < 0) {
    return false;
  }

  for (let i = vl; i-- > 0;) {
    if (buffer[i + dl] !== values[i]) {
      return false;
    }
  }

  return true;
}

export function countEquials<T>(arr1: Readonly<T[]>, arr2: Readonly<T[]>, offset1 = 0, offset2 = 0): number {
  const lMin = Math.min(arr1.length - offset1, arr2.length - offset2);
  for (let i = 0; i < lMin; i++) {
    if (arr1[i + offset1] !== arr2[i + offset2]) {
      return i;
    }
  }
  return Math.max(lMin, 0);
}

export function reverseCountEquials<T>(arr1: Readonly<T[]>, arr2: Readonly<T[]>, offset1 = 0, offset2 = 0): number {
  const l1 = arr1.length - offset1;
  const l2 = arr2.length - offset2;
  const lMin = Math.min(l1, l2);
  for (let i = 0; i < lMin; i++) {
    if (arr1[l1 - 1 - i] !== arr2[l2 - 1 - i]) {
      return i;
    }
  }
  return Math.max(lMin, 0);
}
