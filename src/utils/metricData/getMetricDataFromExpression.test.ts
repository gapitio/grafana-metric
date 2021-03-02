import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, field } from "../field";

import { getMetricDataFromExpression } from "./getMetricDataFromExpression";

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
      fields: [
        field({
          name: "Time",
          type: FieldType.time,
          calcs: {},
          values: [100, 300],
        }),
        field({
          name: "Value",
          type: FieldType.number,
          calcs: {
            [ReducerID.last]: 100,
            [ReducerID.first]: 100,
          },
        }),
      ],
      length: 1,
    },
    {
      name: "series-2",
      fields: [
        field({
          name: "Time",
          type: FieldType.time,
          calcs: {},
          values: [200, 400],
        }),
        field({
          name: "Value",
          type: FieldType.number,
          calcs: {
            [ReducerID.last]: 200,
            [ReducerID.first]: 100,
            [ReducerID.max]: 200,
          },
        }),
      ],
      length: 1,
    },
    {
      name: "series-3",
      fields: [
        TIME_FIELD,
        field({
          name: "Value",
          type: FieldType.number,
          calcs: { [ReducerID.last]: 100, [ReducerID.first]: 500 },
        }),
      ],
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

describe("getMetricDataFromExpression", () => {
  it("retrieves correct value", () => {
    expect(getMetricDataFromExpression("'series-1'+'series-2'")).toStrictEqual({
      calcs: {
        [ReducerID.last]: 300,
        [ReducerID.first]: 200,
        [ReducerID.max]: NaN,
      },
      time: {
        [ReducerID.first]: 100,
        [ReducerID.last]: 400,
      },
      hasData: true,
    });
  });

  describe("Math object", () => {
    it("can use Math.sqrt", () => {
      expect(
        getMetricDataFromExpression("Math.sqrt('series-1')")
      ).toStrictEqual({
        calcs: { first: 10, last: 10 },
        hasData: true,
        time: { first: 100, last: 300 },
      });
    });
    it("can use Math.max", () => {
      expect(
        getMetricDataFromExpression("Math.max('series-1', 1000)")
      ).toStrictEqual({
        calcs: { first: 1000, last: 1000 },
        hasData: true,
        time: { first: 100, last: 300 },
      });
    });
    it("can use Math.PI", () => {
      expect(getMetricDataFromExpression("Math.PI + 'series-1'")).toStrictEqual(
        {
          calcs: { first: 103.1415926535898, last: 103.1415926535898 },
          hasData: true,
          time: { first: 100, last: 300 },
        }
      );
    });
  });

  describe("no data", () => {
    it("gets empty calcs and time back", () => {
      expect(getMetricDataFromExpression("nonExistentName")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
    });
  });

  describe("reducer ids", () => {
    it("returns value based on reducerID", () => {
      expect(
        getMetricDataFromExpression("'series-1' * 2", {
          reducerIDs: [ReducerID.first],
        })
      ).toStrictEqual({
        calcs: {
          [ReducerID.first]: 200,
        },
        time: {
          [ReducerID.first]: 100,
          [ReducerID.last]: 300,
        },
        hasData: true,
      });
    });
  });
});
