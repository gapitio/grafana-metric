import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, TIME_VALUES, valueField } from "../field";

import { getMetricData } from "./getMetricData";

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

describe("getMetricData", () => {
  it("retrieves random value (random = 0.4)", () => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.4);

    expect(getMetricData("series-1", { showcase: true })).toStrictEqual({
      calcs: {
        [ReducerID.allIsNull]: false,
        [ReducerID.allIsZero]: false,
        [ReducerID.count]: 400,
        [ReducerID.delta]: 400,
        [ReducerID.diff]: 400,
        [ReducerID.first]: 400,
        [ReducerID.firstNotNull]: 400,
        [ReducerID.last]: 400,
        [ReducerID.lastNotNull]: 400,
        [ReducerID.logmin]: 400,
        [ReducerID.max]: 400,
        [ReducerID.mean]: 400,
        [ReducerID.min]: 400,
        [ReducerID.range]: 400,
        [ReducerID.step]: 400,
        [ReducerID.sum]: 400,
      },
      time: {
        [ReducerID.first]: 1590485760,
        [ReducerID.last]: 1598075136,
      },
      hasData: true,
    });

    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("retrieves metric value", () => {
    expect(getMetricData("series-2")).toStrictEqual({
      calcs: {
        [ReducerID.last]: 200,
      },
      time: {
        [ReducerID.first]: TIME_VALUES[0],
        [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
      },
      hasData: true,
    });
  });

  describe("no data", () => {
    it("gets empty calcs and time back", () => {
      expect(getMetricData("nonExistentName")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
      expect(getMetricData("minimal")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
    });
  });

  it("evaluates string", () => {
    expect(getMetricData("'series-1'+'series-2'")).toStrictEqual({
      calcs: {
        [ReducerID.last]: 300,
      },
      time: {
        [ReducerID.first]: TIME_VALUES[0],
        [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
      },
      hasData: true,
    });
  });
});
