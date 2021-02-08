import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { createMinimalSeries, createSeries } from "../__mocks__/create-series";

import { getMetricValueByName } from "./getMetricValueByName";

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

describe("getMetricValueByName", () => {
  it("retrieves metric value", () => {
    expect(getMetricValueByName("test", {})).toBe(1000);
  });

  it("returns noDataValue when no value is found", () => {
    expect(getMetricValueByName("nonExistentName")).toBe(null);
    expect(
      getMetricValueByName("nonExistentName", { noDataValue: "something" })
    ).toBe("something");
    expect(getMetricValueByName("minimal", { noDataValue: "something" })).toBe(
      "something"
    );
  });
});
