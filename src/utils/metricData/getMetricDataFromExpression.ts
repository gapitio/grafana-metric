import { evaluateString } from "../evaluateString";
import { Types, getType } from "../getType";

import {
  MetricData,
  MetricDataFromNameOptions,
  TimeData,
  getMetricDataFromName,
} from "./getMetricDataFromName";

export interface CalculateOptions {
  /**
   * Calculate null values
   *
   * @description
   * If multiple metrics are in the same expression
   * - If set to false and shouldCalculateBoolean is false. The first null/boolean metric is used.
   * - If set to false and shouldCalculateBoolean is true. The first null metric is used.
   * - If set to true. The expression is calculated.
   *
   * @example
   * const metricExpression = "'null-series' + 2"
   *
   * {null: false};
   * return null
   *
   * {null: true};
   * return null + 2 // 2
   *
   * @default false
   *
   */
  shouldCalculateNull?: boolean;

  /**
   * Calculate boolean values.
   *
   * @description
   * If multiple metrics are in the same expression
   * - If set to false and shouldCalculateNull is false. The first boolean/null metric is used.
   * - If set to false and shouldCalculateNull is true. The first boolean metric is used.
   * - If set to true. The expression is calculated.
   *
   * @example
   * const metricExpression = "'true-series' + 2"
   *
   * {bool: false};
   * return true
   *
   * {bool: true};
   * return true + 2 // 3
   *
   * @default false
   *
   */
  shouldCalculateBoolean?: boolean;
}

function getCalcs({
  metricExpression,
  metricsData,
  calculateOptions = {
    shouldCalculateNull: false,
    shouldCalculateBoolean: false,
  },
}: {
  metricExpression: string;
  metricsData: {
    [key: string]: MetricData;
  };
  calculateOptions?: CalculateOptions;
}) {
  const { shouldCalculateNull, shouldCalculateBoolean } = calculateOptions;

  // Get all unique calcs keys
  const calcKeys = [
    ...new Set(
      Object.values(metricsData).reduce(
        (arr: string[], { calcs }) => [...arr, ...Object.keys(calcs)],
        []
      )
    ),
  ];

  return Object.fromEntries(
    calcKeys.map((calcKey) => {
      // Used when an expression shouldn't be calculated
      let alternativeValue: null | boolean | undefined;

      const expression = metricExpression.replace(
        /["']([^"']*)["']/g,
        (rawMetricName) => {
          if (alternativeValue !== undefined) return "";

          const metricName = rawMetricName.replace(/["']/g, "");
          const metricData = metricsData[metricName];
          const value = metricData.calcs[calcKey];

          const valueType = getType(value);
          if (
            (valueType == Types.Boolean && shouldCalculateBoolean) ||
            (valueType == Types.Null && shouldCalculateNull)
          )
            alternativeValue = value as boolean | null;

          return String(value);
        }
      );

      const value =
        alternativeValue === undefined
          ? evaluateString(expression)
          : alternativeValue;

      return [calcKey, value];
    })
  );
}

function getTime({
  metricsData,
}: {
  metricsData: {
    [key: string]: MetricData;
  };
}) {
  return Object.values(metricsData).reduce(
    (previous: TimeData, { time: current }) => {
      if (typeof current.first != "number" || typeof current.last != "number")
        return previous;

      const first =
        typeof previous.first == "number"
          ? Math.min(previous.first, current.first)
          : current.first;

      const last =
        typeof previous.last == "number"
          ? Math.max(previous.last, current.last)
          : current.last;

      return {
        first,
        last,
      };
    },
    {}
  );
}

export interface MetricDataFromExpressionOptions
  extends MetricDataFromNameOptions {
  calculateOptions?: CalculateOptions;
}

/**
 * Evaluates a metric expression
 *
 * @param {string} metricExpression - The metric expression E.g "random-metric-1"+"random-metric-2"
 * @param {MetricDataFromExpressionOptions} MetricDataFromExpressionOptions
 */
export function getMetricDataFromExpression(
  metricExpression: string,
  { reducerIDs, calculateOptions }: MetricDataFromExpressionOptions = {}
): MetricData {
  const metricNames = metricExpression.match(/["']([^"']*)["']/g);

  const metricsData = metricNames?.reduce(
    (obj: { [key: string]: MetricData }, rawMetricName) => {
      const metricName = rawMetricName.replace(/["']/g, "");
      obj[metricName] = getMetricDataFromName(metricName, { reducerIDs });

      return obj;
    },
    {}
  );

  if (!metricsData) return { calcs: {}, time: {}, hasData: false };

  const calcs = getCalcs({ metricExpression, metricsData, calculateOptions });

  const hasData = Object.keys(calcs).length > 0;

  const time = getTime({ metricsData });

  return { calcs, time, hasData };
}
