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

describe("getShowcaseMetricValue", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });
  it("retrieves correct value", () => {
    expect(getShowcaseMetricValue()).toEqual(500);
    expect(getShowcaseMetricValue({ range: [0, 10], decimals: 2 })).toEqual(5);
  });
});
