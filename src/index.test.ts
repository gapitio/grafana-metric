import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { createMinimalSeries, createSeries } from "./__mocks__/create-series";

import {
  getMetricValue,
  getMetricValueByName,
  getShowcaseMetricValue,
} from "./index";

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
  it("retrieves correct value", () => {
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

describe("getMetricValue", () => {
  it("retrieves correct value", () => {
    expect(getMetricValue("test", true)).toBeGreaterThanOrEqual(0);
    expect(getMetricValue("test", true)).toBeLessThanOrEqual(1000);
    expect(getMetricValue("test", true, [0, 10], 2)).toBeGreaterThanOrEqual(0);
    expect(getMetricValue("test", true, [0, 10], 2)).toBeLessThanOrEqual(10);
  });
});

describe("getShowcaseMetricValue", () => {
  it("retrieves correct value", () => {
    expect(getShowcaseMetricValue()).toBeGreaterThanOrEqual(0);
    expect(getShowcaseMetricValue()).toBeLessThanOrEqual(1000);
    expect(
      getShowcaseMetricValue({ range: [0, 10], decimals: 2 })
    ).toBeGreaterThanOrEqual(0);
    expect(
      getShowcaseMetricValue({ range: [0, 10], decimals: 2 })
    ).toBeLessThanOrEqual(10);
  });
});
