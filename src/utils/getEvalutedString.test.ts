import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { createSeries } from "../__mocks__/create-series";

import { getEvaluatedString } from "./getEvaluatedString";

declare global {
  interface Window {
    data: PanelData;
  }
}

window.data = {
  state: LoadingState.Done,
  series: [createSeries("series-1", 100), createSeries("series-2", 200)],
  timeRange: {
    from: dateTime(0),
    to: dateTime(0),
    raw: {
      from: dateTime(0),
      to: dateTime(0),
    },
  },
};

describe("getEvaluatedString", () => {
  it("retrieves correct value", () => {
    expect(getEvaluatedString("'series-1'+'series-2'")).toEqual(300);
    expect(getEvaluatedString('"series-1"+"series-2"')).toEqual(300);
    expect(getEvaluatedString("'series-1'")).toEqual(100);
  });

  it("can use Math", () => {
    expect(getEvaluatedString("Math.sqrt('series-1')")).toEqual(10);
    expect(getEvaluatedString("Math.max('series-1', 1000)")).toEqual(1000);
  });

  it("returns noDataValue", () => {
    expect(getEvaluatedString("'nonExistentName' + 'series-1'")).toEqual(null);
    expect(
      getEvaluatedString("Math.sqrt('nonExistentName')", {
        noDataValue: "No data",
      })
    ).toEqual("No data");
  });
});