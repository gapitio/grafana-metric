import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { TIME_FIELD, field } from "../field";

import { getMetricValueWithFilters } from "./getMetricValueWithFilters";

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
        TIME_FIELD,
        field({
          name: "Value",
          type: FieldType.number,
          values: [47, 100],
          labels: { label1: "label1" },
        }),
      ],
      length: 1,
    },
    {
      name: "series-2",
      fields: [
        TIME_FIELD,
        field({
          name: "Value",
          type: FieldType.number,
          values: [200],
          labels: { label2: "label2" },
        }),
      ],
      length: 1,
    },
    {
      name: "series-3",
      fields: [
        TIME_FIELD,
        field({
          name: "FieldName",
          type: FieldType.number,
          values: [300],
          labels: { label3: "label3" },
        }),
      ],
      length: 1,
    },
    {
      name: "series-3",
      fields: [
        TIME_FIELD,
        field({
          name: "FieldName",
          type: FieldType.number,
          values: [400],
          labels: { label3: "label3", label4: "first" },
        }),
      ],
      length: 1,
    },
    {
      name: "series-3",
      fields: [
        TIME_FIELD,
        field({
          name: "FieldName",
          type: FieldType.number,
          values: [500],
          labels: { label3: "label3", label4: "second" },
        }),
      ],
      length: 1,
    },
    {
      name: "series-12",
      fields: [
        TIME_FIELD,
        field({
          name: "FieldName",
          type: FieldType.number,
          values: [100, 200, 300, 400, 500],
          labels: { label3: "label3", label4: "second" },
        }),
      ],
      length: 5,
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
    expect(
      getMetricValueWithFilters({ seriesName: "series-1", showcase: true })
    ).toEqual(500);
    expect(
      getMetricValueWithFilters({
        seriesName: "series-1",
        showcase: true,
        range: { min: 0, max: 10 },
        decimals: 2,
      })
    ).toEqual(5);
  });

  it("retrieves metric value w/o set fieldName & labels", () => {
    expect(getMetricValueWithFilters({ seriesName: "series-1" })).toEqual(100);
  });

  it("retrieves metric value w/o set fieldName", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-1",
        labels: { label1: "label1" },
      })
    ).toEqual(100);
  });

  it("retrieves metric value with all variables", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3" },
      })
    ).toEqual(300);
  });

  it("retrieves first object when multiple is available", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3" },
      })
    ).toEqual(300);
  });

  it("retrieves null when no match is found", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-4",
        fieldName: "FieldName",
        labels: { label3: "label3" },
      })
    ).toEqual(null);
  });

  it("retrieves null when including existing and nonexisting labels", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3", nonExistent: "nonExistent" },
      })
    ).toEqual(null);
  });

  it("retrieves 'No data' when including noDataValue = 'No data'", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3", nonExistent: "nonExistent" },
        noDataValue: "No data",
      })
    ).toEqual("No data");
  });

  it("retrieves correct metric value when multiple labels", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3", label4: "first" },
      })
    ).toEqual(400);
    expect(
      getMetricValueWithFilters({
        seriesName: "series-3",
        fieldName: "FieldName",
        labels: { label3: "label3", label4: "second" },
      })
    ).toEqual(500);
  });

  it("retrieves correct metric value with reducerId", () => {
    expect(
      getMetricValueWithFilters({
        seriesName: "series-12",
        fieldName: "FieldName",
        labels: { label3: "label3" },
        reducerID: "first",
      })
    ).toEqual(100);
    expect(
      getMetricValueWithFilters({
        seriesName: "series-12",
        fieldName: "FieldName",
        labels: { label3: "label3" },
        reducerID: "last",
      })
    ).toEqual(500);
  });
});
