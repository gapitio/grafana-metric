import { DataFrame, Field, PanelData } from "@grafana/data";

import { ReducerID } from "./field";

declare const data: PanelData;

/**
 * Gets the series that contains the seriesName
 *
 * @example
 * ```ts
 * getSeriesByName("series-name");
 * ```
 *
 * @param seriesName
 *
 * @returns The series that contains the seriesName
 */
export function getSeriesByName(seriesName: string): DataFrame | undefined {
  return data.series.find((series) => series.name == seriesName);
}

/**
 * Gets the field that contains the fieldName
 *
 * @example
 * ```ts
 * getFieldByName("field-name");
 * ```
 *
 * @param fieldName
 *
 * @returns The field that contains the fieldName
 */
export function getFieldByName(fieldName: string): Field | undefined {
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
  const valueField = series
    ? getValueField(series.fields)
    : getFieldByName(metricName);

  return valueField?.state?.calcs?.[ReducerID.last] ?? noDataValue;
}
