import { Field } from "@grafana/data";

import { ReducerID } from "../field";
import { getFieldFromName } from "../getFieldFromName";
import { getSeriesFromName } from "../getSeriesFromName";

/**
 * Finds the value field
 *
 * @example
 * ```ts
 * getValueField(series.fields);
 * ```
 *
 * @param fields - Fields object
 *
 * @returns Value field
 */
export function getValueField(fields: Field[]): Field | undefined {
  return fields.find((field) => field.name == "Value");
}

export interface MetricValueFromNameOptions {
  /**
   * Return value when no data is found.
   *
   * @default null
   */
  noDataValue?: unknown;

  /**
   * The calcs key ("last", "first", "max", ReducerID.min)
   *
   * @example
   * getMetricValueFromName("metric-name", {reducerID: ReducerID.first})
   *
   * @default ReducerID.last // "last"
   */
  reducerID?: string;
}

/**
 * Gets a metric value from name/alias
 *
 * @example
 *
 * // metric-name = 100
 *
 * getMetricValueFromName("metric-name") // Returns 100
 * getMetricValueFromName("non-existing-metric") // Returns null
 * getMetricValueFromName("non-existing-metric", { noDataValue: "No data" }) // Returns "No data"
 *
 * @param {string} metricName
 * @param {MetricOptions} metricOptions
 */
export function getMetricValueFromName(
  metricName: string,
  {
    noDataValue = null,
    reducerID = ReducerID.last,
  }: MetricValueFromNameOptions = {}
): unknown {
  const series = getSeriesFromName(metricName);
  const valueField = series
    ? getValueField(series.fields)
    : getFieldFromName(metricName);

  return valueField?.state?.calcs?.[reducerID] ?? noDataValue;
}
