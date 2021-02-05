import { getMetricValueByName } from "..";

/**
 * Evaluates a string
 *
 * @example
 *
 * ```ts
 * evaluateString("2+2") // Returns 4
 * evaluateString("Math.sqrt(100)") // Returns 10
 * ```
 *
 * @param {string} string - Evaluation string ("10+3*5")
 * @return {unknown} Evaluated string
 */
export function evaluateString(string: string): unknown {
  return new Function("return " + string)();
}

interface EvaluationOptions {
  /**
   * Return value when no data is found.
   */
  noDataValue?: unknown;
}

/**
 * Evaluates a metric string
 *
 * @example
 *
 * ```ts
 * // random-metric = 100
 * getEvaluatedString("'random-metric' * 2") // Returns 200
 * getEvaluatedString("Math.sqrt('random-metric')") // Returns 10
 * ```
 *
 * @param {string} metricEvaluationString - The metric calculation string E.g "random-metric-1"+"random-metric-2"
 * @param {EvaluationOptions} options
 * @return {unknown} Evaluated string
 */
export function getEvaluatedString(
  metricEvaluationString: string,
  { noDataValue = null }: EvaluationOptions = {}
): unknown {
  let isNoData = false;
  // Replace the metric names the with metric value
  const splitMetricCalculation = metricEvaluationString.replace(
    /["']([^"']*)["']/g,
    (metricName) => {
      const value = getMetricValueByName(metricName.replace(/["']/g, ""), {
        noDataValue: null,
      });
      if (value == null) {
        isNoData = true;
      }
      return String(value);
    }
  );
  if (isNoData) {
    return noDataValue;
  }
  return evaluateString(splitMetricCalculation);
}
