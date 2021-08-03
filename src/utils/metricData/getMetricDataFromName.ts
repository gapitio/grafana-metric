import { Field } from "@grafana/data";

import { getDataFieldsFromName } from "../getDataFieldsFromName";

function getTime(timeField?: Field) {
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
  valueField,
  reducerIDs,
}: {
  valueField?: Field;
  reducerIDs?: string[];
}) {
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
  const { valueField, timeField } = getDataFieldsFromName(metricName);

  const calcs = getCalcs({ valueField, reducerIDs });
  const hasData = Object.keys(calcs).length > 0;
  const time = hasData ? getTime(timeField) : {};

  return { calcs, time, hasData };
}
