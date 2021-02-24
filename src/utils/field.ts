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

export const TIME_FIELD = field({
  name: "Time",
  type: FieldType.time,
  calcs: {},
});

export function field({
  name,
  type,
  calcs,
  labels,
}: {
  name: string;
  type: FieldType;
  calcs: FieldCalcs;
  labels?: Labels;
}): Field {
  return {
    name,
    type,
    config: {},
    labels: labels,
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
