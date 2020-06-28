/**
 * Miscellaneous math utilities.
 */

import { toString } from './math-utils';

export const DATE_FORMATS = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD'] as const;
export type DateFormat = typeof DATE_FORMATS[number];

/**
 * Returns current date in 'YYYY-MM-DD HH:mm:ss' format.
 */
export function getDate(dateFormat?: DateFormat): string {
  const now = new Date();

  const Y = now.getFullYear();
  const M = toString(now.getMonth() + 1, 2);
  const D = toString(now.getDate(), 2);

  const H = toString(now.getHours(), 2);
  const m = toString(now.getMinutes(), 2);
  const s = toString(now.getSeconds(), 2);

  switch (dateFormat) {
    case 'YYYY-MM-DD HH:mm:ss': return `${Y}-${M}-${D} ${H}:${m}:${s}`;
    case 'YYYY-MM-DD HH:mm': return `${Y}-${M}-${D} ${H}:${m}`;
    case 'YYYY-MM-DD': return `${Y}-${M}-${D}`;
  }

  return `${Y}-${M}-${D} ${H}:${m}:${s}`;
}
