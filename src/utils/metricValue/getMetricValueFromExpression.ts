import { evaluateString } from "../evaluateString";

import {
  MetricValueFromNameOptions,
  getMetricValueFromName,
} from "./getMetricValueFromName";

export type MetricValueFromExpressionOptions = MetricValueFromNameOptions;

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
 * @param {MetricValueFromExpressionOptions} MetricValueFromExpressionOptions
 */
export function getMetricValueFromExpression(
  metricExpression: string,
  { noDataValue = null, reducerID }: MetricValueFromExpressionOptions = {}
): unknown {
  let isNoData = false;
  // Replace the metric names the with metric value
  const expression = metricExpression.replace(
    /["']([^"']*)["']/g,
    (metricName) => {
      const value = getMetricValueFromName(metricName.replace(/["']/g, ""), {
        reducerID,
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
  return evaluateString(expression);
}
