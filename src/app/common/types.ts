/**
 * Helper types.
 */


/**
 * picks by key type
 */
export type SubType<A, T> = Pick<A, { [K in keyof A]: A[K] extends T ? K : never }[keyof A]>;

/**
 * ignores `readonly` properties
 */
export type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };
