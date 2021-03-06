import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, field, valueField } from "../field";

import { getMetricValueFromExpression } from "./getMetricValueFromExpression";

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

describe("getMetricValueFromExpression", () => {
  it("retrieves correct value", () => {
    expect(getMetricValueFromExpression("'series-1'+'series-2'")).toEqual(300);
    expect(getMetricValueFromExpression('"series-1"+"series-2"')).toEqual(300);
    expect(getMetricValueFromExpression("'series-1'")).toEqual(100);
  });

  it("can use Math", () => {
    expect(getMetricValueFromExpression("Math.sqrt('series-1')")).toEqual(10);
    expect(getMetricValueFromExpression("Math.max('series-1', 1000)")).toEqual(
      1000
    );
  });

  it("returns noDataValue", () => {
    expect(
      getMetricValueFromExpression("'nonExistentName' + 'series-1'")
    ).toEqual(null);
    expect(
      getMetricValueFromExpression("Math.sqrt('nonExistentName')", {
        noDataValue: "No data",
      })
    ).toEqual("No data");
  });

  it("returns value based on reducerID", () => {
    expect(
      getMetricValueFromExpression("'series-3' * 2", {
        reducerID: ReducerID.first,
      })
    ).toEqual(1000);
  });
});
