import { Field, FieldCalcs, FieldType, Labels } from "@grafana/data";

export const enum ReducerID {
  sum = "sum",
  max = "max",
  min = "min",
  logmin = "logmin",
  mean = "mean",
  last = "last",
  first = "first",
  count = "count",
  range = "range",
  diff = "diff",
  delta = "delta",
  step = "step",
  firstNotNull = "firstNotNull",
  lastNotNull = "lastNotNull",
  changeCount = "changeCount",
  distinctCount = "distinctCount",
  allIsZero = "allIsZero",
  allIsNull = "allIsNull",
}

export const TIME_VALUES = [
  // Epoch timestamps
  1577836800, // 2020/1/1
  1593561600, // 2020/7/1
  1609372800, // 2020/12/31
];

export const TIME_FIELD = field({
  name: "Time",
  type: FieldType.time,
  calcs: {},
  values: TIME_VALUES,
});

export function field({
  name,
  type,
  calcs,
  labels,
  values = [],
}: {
  name: string;
  type: FieldType;
  calcs?: FieldCalcs;
  labels?: Labels;
  values?: number[];
}): Field {
  return {
    name,
    type,
    config: {},
    labels: labels,
    values: {
      length: values.length,
      get: (index: number) => {
        return values[index];
      },
      toArray: () => values,
    },
    state: {
      displayName: null,
      scopedVars: {},
      calcs,
    },
  };
}

export function valueField(value: unknown): Field {
  return field({
    name: "Value",
    type: FieldType.number,
    calcs: { [ReducerID.last]: value },
  });
}
