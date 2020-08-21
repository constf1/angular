/**
 * Miscellaneous string utilities.
 */

export function commonPrefix(a: string, b: string) {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a.charAt(i) !== b.charAt(i)) {
      return a.substring(0, i);
    }
  }
  return a.substring(0, length);
}

export function commonSuffix(a: string, b: string, start: number = 0) {
  const al = a.length;
  const bl = b.length;
  const ml = Math.min(al, bl) - start;
  for (let i = 0; i < ml; i++) {
    if (a.charAt(al - 1 - i) !== b.charAt(bl - 1 - i)) {
      return a.substring(al - i);
    }
  }
  return a.substring(al - ml);
}


export function padLeft(str: string, width: number, prefix: string = ' ') {
  while (str.length < width && prefix) {
    str = prefix + str;
  }
  return str;
}

export function randomChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length));
}
