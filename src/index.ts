import { PanelData } from "@grafana/data";

import { getEvaluatedString } from "./utils/getEvaluatedString";

declare const data: PanelData;

/**
 * Generate a random number
 *
 * @example
 *
 * getShowcaseMetricValue(); // Returns a value between 0 & 1000 with 2 decimals
 * getShowcaseMetricValue({ range: [ x, y ], decimals: z }); // Return a random value between x & y with z decimals.
 *
 * @param {Array<number>}range - Range of values to return
 * @param {number}decimals - Amount of decimals returned
 */
function getShowcaseMetricValue({
  range = [0, 1000],
  decimals = 2,
}: {
  range?: Array<number>;
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
 * Function provides calculations for grafana queries.
 *
 * @example
 *
 * ```ts
 * getMetricValue("queryAlias") // Returns null if query is not executed.
 * getMetricValue("queryAlias", true); // Returns a random value between 0 and 1000.
 * getMetricValue("queryAlias", true, [1,10]); // Returns random value between 1-10.
 * getMetricValue("queryAlias", true, [1,10], true); // Returns random whole value between 1-10.
 * ```
 *
 * @param metric - String for alias used in grafana query.
 * @param showcase - Decides if values are randomly generated.
 * @param range - Range of values to return.
 * @param decimals - Amount of decimals returned.
 * @param noDataValue - Return value when no data is found.
 */
function getMetricValue(
  metric: string,
  showcase = false,
  range?: Array<number>,
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
