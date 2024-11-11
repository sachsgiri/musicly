/* eslint-disable @typescript-eslint/ban-types */
/**
 * Applies Object.freeze() to a class and it's prototype.
 * Does not freeze all the properties of a class created
 * using 'new' keyword, only static properties and prototype
 * of a class.
 */

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function frozen(constructor: Function): void {
  Object.freeze(constructor);
  Object.freeze(constructor.prototype);
}
