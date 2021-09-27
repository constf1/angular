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

export function randomItem<T>(arr: Readonly<T[]>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle<T>(arr: Array<T>): Array<T> {
  for (let i = arr.length; --i > 0; ) {
    const j = Math.floor((i + 1) * Math.random());
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

export function groupBy<T>(
  items: ReadonlyArray<T>,
  mapper: (item: Readonly<T>) => string | number
): { [key in string | number]: T[] } {
  const map: { [key in string | number]: T[] } = {};

  for (const item of items) {
    const key = mapper(item);
    if (!map[key]) {
      map[key] = [item];
    } else {
      map[key].push(item);
    }
  }

  return map;
}

export type Grader<T> = {
  mapper: (item: Readonly<T>) => string | number;
  picker: (keys: string[]) => (string | number)[];
  fallback?: Grader<T>;
};

export function pickSome<T>(items: T[], limit: number, grader: Grader<T>): T[] {
  if (items.length > limit) {
    const next = grader.fallback;
    const groups = groupBy(items, grader.mapper);
    items = [];
    for (const key of grader.picker(Object.keys(groups))) {
      const size = limit - items.length;
      const group = groups[key];

      // Note: Using spread operator for large arrays may give us nasty: "RangeError: Maximum call stack size exceeded"
      // which we can avoid by using the concat operator.
      // items.push(...groups[key]);
      items = items.concat(
        (next && group.length > size) ? pickSome(groups[key], size, next) : groups[key]);

      if (items.length >= limit) {
        break;
      }
    }
  }

  return items;
}

export function pickSelected<T>(items: ReadonlyArray<T>, includes?: ReadonlyArray<any>, excludes?: ReadonlyArray<any>): T[] {
  const skipIncludes = !includes;
  const skipExcludes = !excludes;
  const picks: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if ((skipIncludes || includes[i]) && (skipExcludes || !excludes[i])) {
      picks.push(items[i]);
    }
  }
  return picks;
}
