import { evaluateString } from "../evaluateString";

import { getMetricValueFromName } from "./getMetricValueFromName";

interface EvaluationOptions {
  /**
   * Return value when no data is found.
   */
  noDataValue?: unknown;
}

/**
 * Evaluates a metric expression
 *
 * @example
 * // random-metric = 100
 *
 * getMetricValueFromExpression("'random-metric' * 2") // Returns 200
 * getMetricValueFromExpression("Math.sqrt('random-metric')") // Returns 10
 *
 * @param {string} metricExpression - The metric expression E.g "random-metric-1"+"random-metric-2"
 * @param {EvaluationOptions} evaluationOptions
 * @return {unknown} Evaluated string
 */
export function getMetricValueFromExpression(
  metricExpression: string,
  { noDataValue = null }: EvaluationOptions = {}
): unknown {
  let isNoData = false;
  // Replace the metric names the with metric value
  const splitMetricCalculation = metricExpression.replace(
    /["']([^"']*)["']/g,
    (metricName) => {
      const value = getMetricValueFromName(metricName.replace(/["']/g, ""), {
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
