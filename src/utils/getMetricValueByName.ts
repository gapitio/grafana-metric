import { PanelData } from "@grafana/data";

declare const data: PanelData;

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
export function getMetricValueByName(
  metricName: string,
  { noDataValue = null }: MetricOptions = {}
): unknown {
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
}
