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
