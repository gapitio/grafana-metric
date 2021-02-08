import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { createMinimalSeries, createSeries } from "../__mocks__/create-series";

import { getMetricValue } from "./getMetricValue";

declare global {
  interface Window {
    data: PanelData;
  }
}

window.data = {
  state: LoadingState.Done,
  series: [
    createSeries("test", 1000),
    createSeries("test", 2),
    createSeries("something", 2000),
    createSeries("something", 2000),
    createSeries("series-1", 100),
    createSeries("series-2", 200),
    createMinimalSeries("minimal"),
  ],
  timeRange: {
    from: dateTime(0),
    to: dateTime(0),
    raw: {
      from: dateTime(0),
      to: dateTime(0),
    },
  },
};

describe("getMetricValue", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });
  it("retrieves random value", () => {
    expect(getMetricValue("test", true)).toEqual(500);
    expect(getMetricValue("test", true, [0, 10], 2)).toEqual(5);
  });

  it("retrieves metric value", () => {
    expect(getMetricValue("test")).toEqual(1000);
    expect(getMetricValue("test", false, [0, 10], 2)).toEqual(1000);
  });

  it("returns noDataValue when no value is found", () => {
    expect(getMetricValue("nonExistentName")).toBe(null);
    expect(
      getMetricValue("nonExistentName", false, [0, 100], 2, "something")
    ).toBe("something");
    expect(getMetricValue("minimal", false, [0, 100], 2, "something")).toBe(
      "something"
    );
  });

  it("evaluates string", () => {
    expect(getMetricValue("'series-1'+'series-2'")).toBe(300);
  });
});
