import { Field, FieldCalcs, FieldType, ReducerID } from "@grafana/data";

export const TIME_FIELD = field({
  name: "Time",
  type: FieldType.time,
  calcs: {},
});

export function field({
  name,
  type,
  calcs,
}: {
  name: string;
  type: FieldType;
  calcs: FieldCalcs;
}): Field {
  return {
    name,
    type,
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
