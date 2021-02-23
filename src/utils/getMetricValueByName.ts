import { Field, PanelData } from "@grafana/data";

declare const data: PanelData;

function getSeriesByName(seriesName: string) {
  return data.series.find((series) => series.name == seriesName);
}

function getFieldByName(fieldName: string): Field | undefined {
  for (const series of data.series) {
    const valueField = series.fields.find((field) => field.name == fieldName);
    if (valueField) return valueField;
  }
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
export function getMetricValueByName(
  metricName: string,
  { noDataValue = null }: MetricOptions = {}
): unknown {
  const series = getSeriesByName(metricName);
  const valueField = series ? series.fields[1] : getFieldByName(metricName);

  return valueField?.state?.calcs?.last ?? noDataValue;
}
