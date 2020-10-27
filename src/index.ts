import { SOMETHING_VARIABLE, somethingFunction } from "./something";

/**
 * Adds x and y together.
 *
 * @example
 *
 * ```ts
 * add(2, 3); // Returns 5
 * ```
 *
 * @param {number} x - Number to be added together.
 * @param {number} y - Number to be added together.
 * @return {number} Returns the sum of x and y.
 */
function add(x: number, y: number): number {
  return x + y;
}

export { SOMETHING_VARIABLE, add, somethingFunction };
