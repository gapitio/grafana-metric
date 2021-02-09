import { LoadingState, PanelData, dateTime } from "@grafana/data";

import { TIME_FIELD, valueField } from "./field";
import { getMetricValueByName } from "./getMetricValueByName";

declare global {
  interface Window {
    data: PanelData;
  }
}

window.data = {
  state: LoadingState.Done,
  series: [
    {
      name: "test",
      fields: [TIME_FIELD, valueField(1000)],
      length: 1,
    },
    {
      name: "minimal",
      fields: [],
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
