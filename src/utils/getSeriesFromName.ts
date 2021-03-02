import { DataFrame, PanelData } from "@grafana/data";

declare const data: PanelData;

/**
 * Gets the series that contains the seriesName
 *
 * @example
 * ```ts
 * getSeriesFromName("series-name");
 * ```
 *
 * @param seriesName
 *
 * @returns The series that contains the seriesName
 */
export function getSeriesFromName(seriesName: string): DataFrame | undefined {
  return data.series.find((series) => series.name == seriesName);
}
