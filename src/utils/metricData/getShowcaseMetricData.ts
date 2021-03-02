import { FieldCalcs } from "@grafana/data";

import { ReducerID } from "../field";

import { MetricData, MetricDataFromNameOptions } from "./getMetricDataFromName";

export interface ShowcaseCalcs {
  [key: string]: { min?: number; max?: number; bool?: boolean };
}

function getShowcaseCalcs({
  reducerIDs,
  showcaseCalcs = {},
  decimals,
}: ShowcaseMetricDataOptions) {
  const enquiredCalcs =
    reducerIDs?.reduce(
      (obj: ShowcaseCalcs, key) => ((obj[key] = showcaseCalcs[key]), obj),
      {}
    ) ?? showcaseCalcs;

  const calcs: FieldCalcs = Object.keys(enquiredCalcs).reduce(
    (obj: { [key: string]: boolean | number }, key) => {
      const calcOptions = enquiredCalcs[key];

      if (calcOptions.bool) {
        obj[key] = Math.random() > 0.5;
      } else if (calcOptions.min != undefined && calcOptions.max != undefined) {
        const randomValue =
          Math.random() * (calcOptions.max - calcOptions.min) + calcOptions.min;
        obj[key] = Number(randomValue.toFixed(decimals));
      }

      return obj;
    },
    {}
  );

  return calcs;
}

export interface ShowcaseMetricDataOptions extends MetricDataFromNameOptions {
  /**
   * The range of the calc values
   *
   * @example
   *
   * const metricData = getShowcaseMetricData({
   *   showcaseCalcs: {
   *     [ReducerID.last]: { min: 10, max: 20 },
   *     [ReducerID.first]: { min: 0, max: 20 },
   *   },
   * });
   *
   *  // metricData
   * {
   *   calcs: {
   *     [ReducerID.first]: 10,
   *     [ReducerID.last]: 15,
   *   },
   *   time: {
   *     [ReducerID.first]: 1593648000,
   *     [ReducerID.last]: 1601553600,
   *   },
   *   hasData: true,
   * }
   *
   */
  showcaseCalcs?: ShowcaseCalcs;
  /**
   * Range for the random time values (first and last)
   */
  timeRange?: { min: number; max: number };
  /**
   * Amount of decimals for each calc value
   */
  decimals?: number;
}

/**
 * Generates a random metric data object
 *
 * @param {ShowcaseMetricDataOptions} ShowcaseMetricDataOptions
 */
export function getShowcaseMetricData({
  reducerIDs,
  showcaseCalcs = {
    [ReducerID.allIsNull]: { bool: true },
    [ReducerID.allIsZero]: { bool: true },
    [ReducerID.count]: { min: 0, max: 1000 },
    [ReducerID.delta]: { min: 0, max: 1000 },
    [ReducerID.diff]: { min: 0, max: 1000 },
    [ReducerID.first]: { min: 0, max: 1000 },
    [ReducerID.firstNotNull]: { min: 0, max: 1000 },
    [ReducerID.last]: { min: 0, max: 1000 },
    [ReducerID.lastNotNull]: { min: 0, max: 1000 },
    [ReducerID.logmin]: { min: 0, max: 1000 },
    [ReducerID.max]: { min: 0, max: 1000 },
    [ReducerID.mean]: { min: 0, max: 1000 },
    [ReducerID.min]: { min: 0, max: 1000 },
    [ReducerID.range]: { min: 0, max: 1000 },
    [ReducerID.step]: { min: 0, max: 1000 },
    [ReducerID.sum]: { min: 0, max: 1000 },
  },
  timeRange = {
    min: 1577836800, // 2020/1/1
    max: 1609459200, // 2020/12/31
  },
  decimals = 2,
}: ShowcaseMetricDataOptions = {}): MetricData {
  const calcs = getShowcaseCalcs({ reducerIDs, showcaseCalcs, decimals });

  const hasData = true;

  const firstTime =
    Math.random() * (timeRange.max - timeRange.min) + timeRange.min;
  const lastTime = Math.random() * (timeRange.max - firstTime) + firstTime;

  const time = {
    [ReducerID.first]: Math.floor(firstTime),
    [ReducerID.last]: Math.floor(lastTime),
  };

  return { calcs, time, hasData };
}
