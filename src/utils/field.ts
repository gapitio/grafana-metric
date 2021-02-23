import { Field, FieldCalcs, FieldType, Labels, ReducerID } from "@grafana/data";

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
