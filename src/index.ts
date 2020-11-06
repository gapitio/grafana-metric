import { PanelData } from "@grafana/data";

declare const data: PanelData;

/**
 * Gets a metric value by name/alias
 *
 * @param {string} metricName
 * @param {object} metricOptions
 */
const getMetricValueByName = (
  metricName: string,
  {
    noDataValue = null,
  }: {
    noDataValue?: unknown;
  } = {}
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

export { getMetricValueByName };
