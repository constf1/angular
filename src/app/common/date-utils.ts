/**
 * Miscellaneous math utilities.
 */

import { toString } from './math-utils';

/**
 * Returns current date in 'YYYY-MM-DD HH:mm:ss' format.
 */
export function getDate(): string {
  const now = new Date();

  const Y = now.getFullYear();
  const M = toString(now.getMonth() + 1, 2);
  const D = toString(now.getDate(), 2);

  const H = toString(now.getHours(), 2);
  const m = toString(now.getMinutes(), 2);
  const s = toString(now.getSeconds(), 2);

  return `${Y}-${M}-${D} ${H}:${m}:${s}`;
}
