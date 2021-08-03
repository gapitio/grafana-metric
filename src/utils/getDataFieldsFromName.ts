import { DataFrame, Field, PanelData } from "@grafana/data";

import { SearchOptions } from "./getFieldFromName";
import { getSeriesFromName } from "./getSeriesFromName";

declare const data: PanelData;

export interface DataFields {
  valueField?: Field;
  timeField?: Field;
}

export interface DataFieldOptions extends SearchOptions {
  /**
   * Get time field
   *
   * @default true
   */
  getTime?: boolean;
}

function getValueField(
  series: DataFrame,
  name: string,
  { searchLabels = true }: SearchOptions = {}
) {
  return series.fields.find((field) =>
    [
      field.name,
      ...(searchLabels && field.labels ? [field.labels.name] : []),
    ].includes(name)
  );
}

function getTimeField(series: DataFrame) {
  return (
    series.fields.find((field) => field.type == "time") ??
    series.fields.find((field) => field.name == "Time" || field.name == "time")
  );
}

function getSeriesAndValueField(
  name: string,
  { searchLabels = true }: SearchOptions = {}
) {
  const series = getSeriesFromName(name);
  if (series) {
    const valueField =
      getValueField(series, "Value", { searchLabels: false }) ??
      getValueField(series, name, { searchLabels });

    return { series, valueField };
  }

  for (const series of data.series) {
    const valueField = getValueField(series, name, { searchLabels });
    if (valueField) return { series, valueField };
  }

  return {};
}

/**
 * Gets the series that contains the name (searches through series, fields and labels)
 *
 * @example
 * ```ts
 * getDataFieldsFromName("series-name");
 * ```
 *
 * @param name
 * @param DataFieldOptions
 *
 * @returns value and time field
 */
export function getDataFieldsFromName(
  name: string,
  { searchLabels = true, getTime = true }: DataFieldOptions = {}
): DataFields | Record<string, never> {
  const { series, valueField } = getSeriesAndValueField(name, { searchLabels });
  if (series && valueField)
    return {
      valueField,
      timeField: getTime ? getTimeField(series) : undefined,
    };
  return {};
}
