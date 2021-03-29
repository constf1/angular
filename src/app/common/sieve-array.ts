export const RANGE_SEPARATOR = ',';
export const RANGE_MEDIATOR = '-';

export function sieveArray(size: number, ranges?: string): Array<true | undefined> {
  const selected: Array<true | undefined> = new Array(size);

  // Remove white spaces from the input text.
  const input = (ranges || '').replace(/\s+/g, '');

  if (input) {
    const reNumber = /^\d+$/;
    // Parse input into selection ranges.
    for (const term of input.split(RANGE_SEPARATOR)) {
      if (reNumber.test(term)) {
        const index = +term;
        if (index > 0 && index <= size) {
          selected[index - 1] = true;
        }
      } else {
        const range = term.split(RANGE_MEDIATOR);
        const start = +range[0];
        const end = +range[1];
        if (start >= 1 && end >= start) {
          const stop = Math.min(end, size);
          for (let i = start - 1; i < stop; i++) {
            selected[i] = true;
          }
        }
      }
    }
  }

  return selected;
}
