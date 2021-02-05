import { PanelData } from "@grafana/data";

import { getEvaluatedString } from "./utils/getEvaluatedString";

declare const data: PanelData;

/**
 * Generate a random number
 *
 * @example
 *
 * getShowcaseMetricValue(); // Returns a value between 0 and 1000 with 2 decimals
 * getShowcaseMetricValue({ range: [ x, y ], decimals: z }); // Return a random value between x and y with z decimals.
 *
 * @param {[number, number]>} range - Range of values to return
 * @param {number} decimals - Amount of decimals returned
 */
function getShowcaseMetricValue({
  range = [0, 1000],
  decimals = 2,
}: {
  range?: [number, number];
  decimals?: number;
} = {}): number {
  let value = Math.random();
  const fixedValue = (value * (range[1] - range[0]) + range[0]).toFixed(
    decimals
  );
  value = parseFloat(fixedValue);
  return value;
}

export interface MetricOptions {
  /**
   * Return value when no data is found.
   */
  noDataValue?: unknown;
}

/**
 * Gets a metric value by name/alias
 *
 * @example
 *
 * // metric-name = 100
 *
 * getMetricValueByName("metric-name") // Returns 100
 * getMetricValueByName("non-existing-metric") // Returns null
 * getMetricValueByName("non-existing-metric", { noDataValue: "No data" }) // Returns "No data"
 *
 * @param {string} metricName
 * @param {MetricOptions} metricOptions
 */
const getMetricValueByName = (
  metricName: string,
  { noDataValue = null }: MetricOptions = {}
): unknown => {
  const filteredSeries = data.series.filter(
    (series) => series.name == metricName
  );
  if (filteredSeries.length > 0) {
    const valueField = filteredSeries[0].fields[1];

    if (valueField && valueField.state && valueField.state.calcs) {
      return valueField.state.calcs.last;
    }
  }
  return noDataValue;
};

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
 * @param showcase - Decides if values are randomly generated.
 * @param range - Range of values to return (only with showcase)
 * @param decimals - Amount of decimals returned (only with showcase)
 * @param noDataValue - Return value when no data is found.
 */
function getMetricValue(
  metric: string,
  showcase = false,
  range?: [number, number],
  decimals?: number,
  noDataValue: unknown = null
): unknown {
  if (showcase) {
    return getShowcaseMetricValue({ range, decimals });
  } else if (metric.includes('"') || metric.includes("'")) {
    return getEvaluatedString(metric);
  }

  return getMetricValueByName(metric, { noDataValue });
}

export {
  getEvaluatedString,
  getMetricValue,
  getMetricValueByName,
  getShowcaseMetricValue,
};
