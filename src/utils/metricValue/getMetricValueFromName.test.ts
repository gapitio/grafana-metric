import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, field, valueField } from "../field";

import { getMetricValueFromName } from "./getMetricValueFromName";

declare global {
  interface Window {
    data?: PanelData;
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
          calcs: { [ReducerID.last]: 100, [ReducerID.first]: 500 },
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
    {
      fields: [
        TIME_FIELD,
        field({
          name: "random-value-field",
          type: FieldType.number,
          values: [1000, 500, 300],
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

describe("getMetricValueFromName", () => {
  it("returns noDataValue when no value is found", () => {
    expect(getMetricValueFromName("nonExistentName")).toBe(null);
    expect(
      getMetricValueFromName("nonExistentName", { noDataValue: "something" })
    ).toBe("something");
    expect(
      getMetricValueFromName("minimal", { noDataValue: "something" })
    ).toBe("something");
  });

  describe("reducer id", () => {
    it("gets last value from field", () => {
      expect(getMetricValueFromName("field-1")).toBe(100);
    });
    it("gets first value from field", () => {
      expect(
        getMetricValueFromName("field-1", { reducerID: ReducerID.first })
      ).toBe(500);
    });
  });

  describe("series name", () => {
    it("gets correct value from field name", () => {
      expect(getMetricValueFromName("series-1", {})).toBe(1000);
    });
  });

  describe("field name", () => {
    it("gets correct value from field name", () => {
      expect(getMetricValueFromName("field-1")).toEqual(100);
    });
  });

  describe("label name", () => {
    it("gets correct value from label name", () => {
      expect(getMetricValueFromName("label-1")).toEqual(300);
    });
  });

  describe("missing calcs", () => {
    it("gets correct value from label name", () => {
      expect(getMetricValueFromName("random-value-field")).toEqual(300);
      expect(
        getMetricValueFromName("random-value-field", {
          reducerID: ReducerID.first,
        })
      ).toEqual(1000);
    });
  });
});
