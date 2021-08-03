import { ReducerID } from "../field";
import { getDataFieldsFromName } from "../getDataFieldsFromName";

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
  const { valueField } = getDataFieldsFromName(metricName, { getTime: false });
  return valueField?.state?.calcs?.[reducerID] ?? noDataValue;
}
