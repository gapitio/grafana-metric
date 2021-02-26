/**
 * Evaluates a string
 *
 * @example
 *
 * evaluateString("2+2") // Returns 4
 * evaluateString("Math.sqrt(100)") // Returns 10
 *
 * @param {string} string - Evaluation string ("10+3*5")
 * @return {unknown} Evaluated string
 */
export function evaluateString(string: string): unknown {
  return new Function("return " + string)();
}
