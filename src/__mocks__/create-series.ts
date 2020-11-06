import { DataFrame, FieldType } from "@grafana/data";

const TIME_FIELD = {
  name: "Time",
  type: FieldType.time,
  config: {},
  values: {
    length: 0,
    get: (index: number) => {
      return [][index];
    },
    toArray: () => [],
  },
  state: {
    displayName: null,
    scopedVars: {},
  },
};

function valueField(value: number) {
  return {
    name: "Value",
    type: FieldType.number,
    config: {},
    values: {
      length: 0,
      get: (index: number) => {
        return [][index];
      },
      toArray: () => [],
    },
    state: {
      displayName: null,
      scopedVars: {},
      calcs: {
        allIsNull: false,
        allIsZero: false,
        count: 1,
        delta: value,
        diff: value,
        first: value,
        firstNotNull: value,
        last: value,
        lastNotNull: value,
        logmin: value,
        max: value,
        mean: value,
        min: 0,
        nonNullCount: 1,
        previousDeltaUp: true,
        range: value,
        step: value,
        sum: value,
      },
    },
  };
}

function createMinimalSeries(name: string, refId = "A"): DataFrame {
  return {
    name: name,
    fields: [],
    length: 1,
    refId: refId,
    meta: undefined,
  };
}

function createSeries(name: string, value: number, refId = "A"): DataFrame {
  const series = createMinimalSeries(name, refId);
  series.fields.push(TIME_FIELD, valueField(value));

  return series;
}

export { createMinimalSeries, createSeries };
