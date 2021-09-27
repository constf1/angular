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

export type KeyOfType<T, V> = {
  [P in keyof T]: T[P] extends V ? P: never
} [keyof T];

export type ReadonlyByKey<T extends unknown , K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;
export type ReadonlyByType<T, V> = ReadonlyByKey<T, KeyOfType<T, V>>;

type RecursivePartial<T> = {
  [P in keyof T]? : T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P];
};
