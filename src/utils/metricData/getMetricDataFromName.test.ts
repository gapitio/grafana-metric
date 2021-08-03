import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

import { ReducerID, TIME_FIELD, TIME_VALUES, field } from "../field";

import { getMetricDataFromName } from "./getMetricDataFromName";

declare global {
  interface Window {
    data?: PanelData;
  }
}

const minimalTimeRange = {
  from: dateTime(0),
  to: dateTime(0),
  raw: {
    from: dateTime(0),
    to: dateTime(0),
  },
};

describe("getMetricDataFromName", () => {
  describe("no data", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            name: "minimal",
            fields: [],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets empty calcs and time back", () => {
      expect(getMetricDataFromName("nonExistentName")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
      expect(getMetricDataFromName("minimal")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
      expect(getMetricDataFromName("")).toStrictEqual({
        calcs: {},
        time: {},
        hasData: false,
      });
    });
  });

  describe("no time", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            name: "no-time-field",
            fields: [
              field({
                name: "Value",
                type: FieldType.number,
                calcs: { [ReducerID.last]: 10 },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets empty time back when no time field exists", () => {
      expect(getMetricDataFromName("no-time-field")).toStrictEqual({
        calcs: {
          [ReducerID.last]: 10,
        },
        time: {},
        hasData: true,
      });
    });
  });

  describe("series name", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            fields: [
              field({
                name: "Time",
                type: FieldType.time,
                calcs: {},
                values: [1577736800, 1577936800],
              }),
              field({
                name: "field-0",
                type: FieldType.number,
                calcs: { [ReducerID.last]: 100 },
              }),
            ],
            length: 1,
          },
          {
            name: "series-1",
            fields: [
              TIME_FIELD,
              field({
                name: "Value",
                type: FieldType.number,
                calcs: {
                  [ReducerID.last]: 1000,
                  [ReducerID.first]: 100,
                  [ReducerID.max]: 1000,
                },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets correct values from series name", () => {
      expect(getMetricDataFromName("series-1")).toStrictEqual({
        calcs: {
          [ReducerID.last]: 1000,
          [ReducerID.first]: 100,
          [ReducerID.max]: 1000,
        },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("field name", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            fields: [
              field({
                name: "Time",
                type: FieldType.time,
                calcs: {},
                values: [1577736800, 1577936800],
              }),
              field({
                name: "field-0",
                type: FieldType.number,
                calcs: { [ReducerID.last]: 100 },
              }),
            ],
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
            ],
            length: 1,
          },
          {
            fields: [
              field({
                name: "Time",
                type: FieldType.time,
                calcs: {},
                values: [1577736800, 1577936800],
              }),
              field({
                name: "field-2",
                type: FieldType.number,
                calcs: { [ReducerID.last]: 100 },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets correct value from field name", () => {
      expect(getMetricDataFromName("field-1")).toStrictEqual({
        calcs: { [ReducerID.last]: 100 },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("label name", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            fields: [
              field({
                name: "Time",
                type: FieldType.time,
                calcs: {},
                values: [1577736800, 1577936800],
              }),
              field({
                name: "field-0",
                type: FieldType.number,
                calcs: { [ReducerID.last]: 100 },
              }),
            ],
            length: 1,
          },
          {
            fields: [
              TIME_FIELD,
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
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets correct value from label name", () => {
      expect(getMetricDataFromName("label-1")).toStrictEqual({
        calcs: { [ReducerID.last]: 300 },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("reducerIDs", () => {
    beforeEach(() => {
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
                calcs: {
                  [ReducerID.last]: 1000,
                  [ReducerID.first]: 100,
                  [ReducerID.max]: 1000,
                },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("gets correct calcs", () => {
      expect(
        getMetricDataFromName("series-1", {
          reducerIDs: [ReducerID.first, ReducerID.max],
        })
      ).toStrictEqual({
        calcs: {
          [ReducerID.first]: 100,
          [ReducerID.max]: 1000,
        },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("timeField name is time", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            name: "series-1",
            fields: [
              field({
                name: "time",
                type: FieldType.time,
                calcs: {},
                values: TIME_VALUES,
              }),
              field({
                name: "Value",
                type: FieldType.number,
                calcs: {
                  [ReducerID.last]: 1000,
                  [ReducerID.first]: 100,
                  [ReducerID.max]: 1000,
                },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("get correct time", () => {
      expect(getMetricDataFromName("series-1")).toStrictEqual({
        calcs: {
          [ReducerID.last]: 1000,
          [ReducerID.first]: 100,
          [ReducerID.max]: 1000,
        },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("timeField relies on type", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            name: "series-1",
            fields: [
              field({
                name: "Random",
                type: FieldType.time,
                calcs: {},
                values: TIME_VALUES,
              }),
              field({
                name: "Value",
                type: FieldType.number,
                calcs: {
                  [ReducerID.last]: 1000,
                  [ReducerID.first]: 100,
                  [ReducerID.max]: 1000,
                },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("get correct time", () => {
      expect(getMetricDataFromName("series-1")).toStrictEqual({
        calcs: {
          [ReducerID.last]: 1000,
          [ReducerID.first]: 100,
          [ReducerID.max]: 1000,
        },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });

  describe("timeField with wrong type but correct name", () => {
    beforeEach(() => {
      window.data = {
        state: LoadingState.Done,
        series: [
          {
            name: "series-1",
            fields: [
              field({
                name: "Time",
                type: FieldType.number,
                calcs: {},
                values: TIME_VALUES,
              }),
              field({
                name: "Value",
                type: FieldType.number,
                calcs: {
                  [ReducerID.last]: 1000,
                  [ReducerID.first]: 100,
                  [ReducerID.max]: 1000,
                },
              }),
            ],
            length: 1,
          },
        ],
        timeRange: minimalTimeRange,
      };
    });

    afterEach(() => {
      delete window.data;
    });

    it("get correct time", () => {
      expect(getMetricDataFromName("series-1")).toStrictEqual({
        calcs: {
          [ReducerID.last]: 1000,
          [ReducerID.first]: 100,
          [ReducerID.max]: 1000,
        },
        time: {
          [ReducerID.first]: TIME_VALUES[0],
          [ReducerID.last]: TIME_VALUES[TIME_VALUES.length - 1],
        },
        hasData: true,
      });
    });
  });
});
