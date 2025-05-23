export type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * Exclude all function properties from type.
 */
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
