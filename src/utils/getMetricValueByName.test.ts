import {
  FieldType,
  LoadingState,
  PanelData,
  ReducerID,
  dateTime,
} from "@grafana/data";

import { TIME_FIELD, field, valueField } from "./field";
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
      name: "minimal",
      fields: [],
      length: 1,
    },
    {
      name: "series-1",
      fields: [TIME_FIELD, valueField(1000)],
      length: 1,
    },
    {
      fields: [
        TIME_FIELD,
        field({
          name: "field-1",
          type: FieldType.number,
          calcs: { [ReducerID.last]: 100 },
        }),
        field({
          name: "field-2",
          type: FieldType.number,
          calcs: { [ReducerID.last]: 200 },
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

describe("getMetricValueByName", () => {
  it("retrieves metric value", () => {
    expect(getMetricValueByName("series-1", {})).toBe(1000);
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

  describe("field name", () => {
    it("gets correct value from field names", () => {
      expect(getMetricValueByName("field-1")).toEqual(100);
    });
  });
});
