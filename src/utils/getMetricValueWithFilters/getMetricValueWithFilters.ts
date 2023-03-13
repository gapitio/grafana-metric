import { DataFrame, Field, PanelData } from "@grafana/data";

import { getShowcaseMetricValue } from "../metricValue/getShowcaseMetricValue";

declare const data: PanelData;

function getMultipleSeriesFromName(
  seriesName: string
): DataFrame[] | undefined {
  return data.series.filter((series) => series.name === seriesName);
}

function getValueFieldsFromSeries(series: DataFrame[], fieldName: string) {
  return series
    .map(({ fields }) =>
      fields.find((field) =>
        [field.name, field.state?.displayName].includes(fieldName)
      )
    )
    .filter((x): x is Exclude<typeof x, undefined> => x !== undefined);
}

function getValueFieldsFromName(metricName: string, fieldName: string) {
  const series = getMultipleSeriesFromName(metricName);
  if (series) {
    return getValueFieldsFromSeries(series, fieldName);
  }
  return null;
}

function getValueFieldFromLabels(
  valueFields: Field[],
  labels: Record<string, string>
) {
  return valueFields.find(({ labels: fieldLabels }) =>
    Object.entries(labels).every(
      ([k, v]) => fieldLabels && fieldLabels[k] === v
    )
  );
}

function getMetricSeries(
  metricName: string,
  fieldName: string,
  labels: Record<string, string>
) {
  const valueFields = getValueFieldsFromName(metricName, fieldName);
  if (valueFields) {
    const valueField = getValueFieldFromLabels(valueFields, labels);
    const length = valueField?.values.length;
    return length ? valueField.values.get(length - 1) : null;
  }
  return null;
}

/**
 * Function provides value from grafana queries based on given filters.
 *
 * @example
 *
 * getMetricValueWithFilters({seriesName: "series-1"}); // Returns first series with name "series-1".
 * 
 * getMetricValueWithFilters({
     seriesName: "series-1",
     fieldName: "field-1",
   }); // Returns first series with name "series-1" and fieldName "field-1".
 *
 * getMetricValueWithFilters({
     seriesName: "series-1",
     fieldName: "field-1",
     labels: { someLabelKey: "label-1", anotherLabelKey: "label-2" },
   }) // Returns first series with name "series-1", fieldName "field-1" and field contains matching labels.
 *
 * // Showcase
 * getMetricValueWithFilters({ seriesName: "series-1", showcase: true }) // Returns a random value between 0 and 1000.
 * 
 * getMetricValueWithFilters({
    seriesName: "series-1",
    showcase: true,
    range: { min: 0, max: 10 },
    decimals: 2,
  }) // Returns random value between 1-10.
 *
 * @param seriesName - String for identifying correct series in Grafanas data object.
 * @param fieldName - String for identifying correct field in series(Defaults to "Value").
 * @param labels - Object for filtering a specific series when multiple series have the same seriesName.
 * @param showcase - Boolean for returning random showcase value.
 * @param range - Object for setting minimum(min:) or maximum(max:) range for showcase value.
 * @param decimals - Number for setting static amount of decimals for showcase value.
 */
export function getMetricValueWithFilters({
  seriesName,
  fieldName = "Value",
  labels = {},
  showcase,
  range,
  decimals,
}: {
  seriesName: string;
  fieldName?: string;
  labels?: Record<string, string>;
  showcase?: boolean;
  range?: { min: number; max: number };
  decimals?: number;
}): unknown {
  if (showcase) {
    return getShowcaseMetricValue({ range, decimals });
  }
  return getMetricSeries(seriesName, fieldName, labels);
}