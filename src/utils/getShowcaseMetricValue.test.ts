import { getShowcaseMetricValue } from "./getShowcaseMetricValue";

describe("getShowcaseMetricValue", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });
  it("retrieves random value", () => {
    expect(getShowcaseMetricValue()).toEqual(500);
    expect(getShowcaseMetricValue({ range: [0, 10], decimals: 2 })).toEqual(5);
  });
});
