export interface ShowcaseMetricValueOptions {
  /**
   * Range of random values
   */
  range?: { min: number; max: number };
  /**
   * Amount of decimals for the random value
   */
  decimals?: number;
}

/**
 * Generate a random number
 *
 * @example
 *
 * getShowcaseMetricValue(); // Returns a value between 0 and 1000 with 2 decimals
 * getShowcaseMetricValue({ range: { min: x, max: y }, decimals: z }); // Return a random value between x and y with z decimals.
 *
 * @param {ShowcaseMetricValueOptions} ShowcaseMetricValueOptions
 */
export function getShowcaseMetricValue({
  range = { min: 0, max: 1000 },
  decimals = 2,
}: ShowcaseMetricValueOptions = {}): number {
  const value = Math.random() * (range.max - range.min) + range.min;
  return Number(value.toFixed(decimals));
}
