import { DataFrame } from "@grafana/data";

import { getFieldFromName } from "../getFieldFromName";
import { getSeriesFromName } from "../getSeriesFromName";

function getTime(series?: DataFrame) {
  const timeField =
    series?.fields.find((field) => field.name == "Time") ??
    getFieldFromName("Time");

  const timeValues = timeField?.values;
  const time = timeValues
    ? {
        first: timeValues.get(0),
        last: timeValues.get(timeValues.length - 1),
      }
    : {};

  return time;
}

function getCalcs({
  series,
  metricName,
  reducerIDs,
}: {
  series?: DataFrame;
  metricName?: string;
  reducerIDs?: string[];
}) {
  const valueField =
    series?.fields.find((field) => field.name == "Value") ??
    (metricName ? getFieldFromName(metricName) : undefined);

  const calcs = valueField?.state?.calcs ?? {};
  const enquiredCalcs =
    reducerIDs?.reduce(
      (obj: { [key: string]: unknown }, key) => ((obj[key] = calcs[key]), obj),
      {}
    ) ?? calcs;

  return enquiredCalcs;
}

export interface MetricDataFromNameOptions {
  /**
   * The calcs keys ("last", "first", "max", ReducerID.min)
   *
   * @example
   * getMetricDataFromName("metric-name", {reducerIDs: [ReducerID.last, ReducerID.first]})
   *
   */
  reducerIDs?: string[];
}

export interface TimeData {
  first?: unknown;
  last?: unknown;
}

export interface MetricData {
  calcs: { [key: string]: unknown };
  time: TimeData;
  hasData: boolean;
}

/**
 * Gets metric data by name/alias
 *
 * @param {string} metricName
 * @param {MetricDataFromNameOptions} metricOptions
 */
export function getMetricDataFromName(
  metricName: string,
  { reducerIDs }: MetricDataFromNameOptions = {}
): MetricData {
  const series = getSeriesFromName(metricName);
  const calcs = getCalcs({ series, metricName, reducerIDs });
  const hasData = Object.keys(calcs).length > 0;
  const time = hasData ? getTime(series) : {};

  return { calcs, time, hasData };
}
