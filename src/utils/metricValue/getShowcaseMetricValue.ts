/**
 * Generate a random number
 *
 * @example
 *
 * getShowcaseMetricValue(); // Returns a value between 0 and 1000 with 2 decimals
 * getShowcaseMetricValue({ range: [ x, y ], decimals: z }); // Return a random value between x and y with z decimals.
 *
 * @param {[number, number]>} range - Range of values to return
 * @param {number} decimals - Amount of decimals returned
 */
export function getShowcaseMetricValue({
  range = [0, 1000],
  decimals = 2,
}: {
  range?: [number, number];
  decimals?: number;
} = {}): number {
  let value = Math.random();
  const fixedValue = (value * (range[1] - range[0]) + range[0]).toFixed(
    decimals
  );
  value = parseFloat(fixedValue);
  return value;
}
