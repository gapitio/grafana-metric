import { DataFrame, Field, PanelData } from "@grafana/data";

import { ReducerID } from "../field";

declare const data: PanelData;

/**
 * Gets the series that contains the seriesName
 *
 * @example
 * ```ts
 * getSeriesFromName("series-name");
 * ```
 *
 * @param seriesName
 *
 * @returns The series that contains the seriesName
 */
export function getSeriesFromName(seriesName: string): DataFrame | undefined {
  return data.series.find((series) => series.name == seriesName);
}

/**
 * Gets the field that contains the fieldName
 *
 * @example
 * ```ts
 * getFieldFromName("field-name");
 * ```
 *
 * @param fieldName
 *
 * @returns The field that contains the fieldName
 */
export function getFieldFromName(fieldName: string): Field | undefined {
  for (const series of data.series) {
    const valueField = series.fields.find((field) =>
      [field.name, ...(field.labels ? [field.labels.name] : [])].includes(
        fieldName
      )
    );
    if (valueField) return valueField;
  }
}

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
