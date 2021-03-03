import { getMetricDataFromExpression } from "./getMetricDataFromExpression";
import {
  MetricData,
  MetricDataFromNameOptions,
  getMetricDataFromName,
} from "./getMetricDataFromName";
import {
  ShowcaseMetricDataOptions,
  getShowcaseMetricData,
} from "./getShowcaseMetricData";

interface MetricDataOptions
  extends MetricDataFromNameOptions,
    ShowcaseMetricDataOptions {
  /**
   * Decides if values are randomly generated.
   * Required for showcaseCalcs, timeRange and decimals.
   */
  showcase?: boolean;
}

/**
 * Gets metric data
 *
 * @param metricName - String for alias used in grafana query.
 * @param {Options} options
 */
export function getMetricData(
  metricName: string,
  {
    reducerIDs,
    showcase,
    showcaseCalcs,
    timeRange,
    decimals,
  }: MetricDataOptions = {}
): MetricData {
  if (showcase) {
    return getShowcaseMetricData({
      reducerIDs,
      showcaseCalcs,
      timeRange,
      decimals,
    });
  } else if (metricName.includes('"') || metricName.includes("'")) {
    return getMetricDataFromExpression(metricName, { reducerIDs });
  }

  return getMetricDataFromName(metricName, { reducerIDs });
}
