import { getMetricValueFromExpression } from "./getMetricValueFromExpression";
import {
  MetricValueFromNameOptions,
  getMetricValueFromName,
} from "./getMetricValueFromName";
import {
  ShowcaseMetricValueOptions,
  getShowcaseMetricValue,
} from "./getShowcaseMetricValue";

interface MetricValueOptions
  extends MetricValueFromNameOptions,
    ShowcaseMetricValueOptions {
  /**
   * Decides if values are randomly generated.
   * Required for range and decimals.
   */
  showcase?: boolean;
}

/**
 * Function provides calculations for grafana queries
 *
 * @example
 *
 * // metric-name = 100
 *
 * // By name
 * getMetricValue("metric-name") // Returns 100
 *
 * // No data
 * getMetricValue("non-existing-metric") // Returns null
 * getMetricValue("non-existing-metric", false, [0, 10], 2, "No data") // Returns "No data"
 *
 * // Evaluation string
 * getMetricValue("'metric-name' * 2") // Returns 200
 * getMetricValue("Math.sqrt('metric-name')") // Returns 10
 *
 * // Showcase
 * getMetricValue("metric-name", true); // Returns a random value between 0 and 1000.
 * getMetricValue("metric-name", true, [1, 10]); // Returns random value between 1-10.
 * getMetricValue("metric-name", true, [1, 10], 4); // Returns random value between 1-10 with 4 decimals.
 *
 * @param metric - String for alias used in grafana query.
 * @param {MetricValueOptions} MetricValueOptions
 */
export function getMetricValue(
  metric: string,
  { showcase, range, decimals, noDataValue, reducerID }: MetricValueOptions = {}
): unknown {
  if (showcase) {
    return getShowcaseMetricValue({ range, decimals });
  } else if (metric.includes('"') || metric.includes("'")) {
    return getMetricValueFromExpression(metric, { noDataValue, reducerID });
  }

  return getMetricValueFromName(metric, { noDataValue, reducerID });
}
