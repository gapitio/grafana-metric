import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, field, valueField } from "./field";
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
        field({
          name: "Value",
          type: FieldType.number,
          calcs: { [ReducerID.last]: 300 },
          labels: { name: "label-1" },
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
  it("returns noDataValue when no value is found", () => {
    expect(getMetricValueByName("nonExistentName")).toBe(null);
    expect(
      getMetricValueByName("nonExistentName", { noDataValue: "something" })
    ).toBe("something");
    expect(getMetricValueByName("minimal", { noDataValue: "something" })).toBe(
      "something"
    );
  });

  describe("series name", () => {
    it("gets correct value from field name", () => {
      expect(getMetricValueByName("series-1", {})).toBe(1000);
    });
  });

  describe("field name", () => {
    it("gets correct value from field name", () => {
      expect(getMetricValueByName("field-1")).toEqual(100);
    });
  });

  describe("label name", () => {
    it("gets correct value from label name", () => {
      expect(getMetricValueByName("label-1")).toEqual(300);
    });
  });
});
