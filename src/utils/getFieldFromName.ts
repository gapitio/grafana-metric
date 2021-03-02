import { Field, PanelData } from "@grafana/data";

declare const data: PanelData;

export interface SearchOptions {
  /**
   * Search through labels to find field
   */
  searchLabels?: boolean;
}

/**
 * Gets the field that contains the fieldName
 *
 * @example
 * ```ts
 * getFieldFromName("field-name");
 * ```
 *
 * @param fieldName
 * @param searchOptions
 *
 * @returns The field that contains the fieldName
 */
export function getFieldFromName(
  fieldName: string,
  { searchLabels = true }: SearchOptions = {}
): Field | undefined {
  for (const series of data.series) {
    const valueField = series.fields.find((field) =>
      [
        field.name,
        ...(searchLabels && field.labels ? [field.labels.name] : []),
      ].includes(fieldName)
    );
    if (valueField) return valueField;
  }
}
