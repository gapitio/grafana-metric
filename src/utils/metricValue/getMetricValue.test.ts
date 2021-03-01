import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { TIME_FIELD, valueField } from "../field";

import { getMetricValue } from "./getMetricValue";

declare global {
  interface Window {
    data?: PanelData;
  }
}

window.data = {
  state: LoadingState.Done,
  series: [
    {
      name: "series-1",
      fields: [TIME_FIELD, valueField(100)],
      length: 1,
    },
    {
      name: "series-2",
      fields: [TIME_FIELD, valueField(200)],
      length: 1,
    },
    {
      name: "series-3",
      fields: [TIME_FIELD, valueField(300)],
      length: 1,
    },
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
    expect(getMetricValue("series-2", { showcase: true })).toEqual(500);
    expect(
      getMetricValue("series-2", {
        showcase: true,
        range: { min: 0, max: 10 },
        decimals: 2,
      })
    ).toEqual(5);
  });

  it("retrieves metric value", () => {
    expect(getMetricValue("series-2")).toEqual(200);
    expect(
      getMetricValue("series-2", {
        showcase: false,
        range: { min: 0, max: 10 },
        decimals: 2,
      })
    ).toEqual(200);
  });

  it("returns noDataValue when no value is found", () => {
    expect(getMetricValue("nonExistentName")).toBe(null);
    expect(
      getMetricValue("nonExistentName", { noDataValue: "something" })
    ).toBe("something");
    expect(getMetricValue("minimal", { noDataValue: "something" })).toBe(
      "something"
    );
  });

  it("evaluates string", () => {
    expect(getMetricValue("'series-1'+'series-2'")).toBe(300);
  });
});
