import { evaluateString } from "../evaluateString";

import {
  MetricData,
  MetricDataFromNameOptions,
  TimeData,
  getMetricDataFromName,
} from "./getMetricDataFromName";

function getCalcs({
  metricExpression,
  metricsData,
}: {
  metricExpression: string;
  metricsData: {
    [key: string]: MetricData;
  };
}) {
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
      const expression = metricExpression.replace(
        /["']([^"']*)["']/g,
        (rawMetricName) => {
          const metricName = rawMetricName.replace(/["']/g, "");
          const metricData = metricsData[metricName];
          const value = metricData.calcs[calcKey];

          return String(value);
        }
      );

      return [calcKey, evaluateString(expression)];
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

export type MetricDataFromExpressionOptions = MetricDataFromNameOptions;

/**
 * Evaluates a metric expression
 *
 * @param {string} metricExpression - The metric expression E.g "random-metric-1"+"random-metric-2"
 * @param {MetricDataFromExpressionOptions} MetricDataFromExpressionOptions
 */
export function getMetricDataFromExpression(
  metricExpression: string,
  { reducerIDs }: MetricDataFromExpressionOptions = {}
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

  const calcs = getCalcs({ metricExpression, metricsData });

  const hasData = Object.keys(calcs).length > 0;

  const time = getTime({ metricsData });

  return { calcs, time, hasData };
}
