import {
  ParameterMetadata,
  PropertyMetadata,
  TypeMetadata,
  TypeTest,
} from "../types";
import { ItemsHelper } from "./helpers/items-helper";
import { ValuesHelper } from "./helpers/values-helper";
import { Values, ValueMetadata, CoreValue } from "./types/values";

const valuesHelper = new ValuesHelper();
const itemsHelper = new ItemsHelper();

export interface ValueError {
  key: string;
  valueId: string;
}

export class Validator {
  static validate(
    root: CoreValue,
    values: { [valueId: string]: ValueMetadata },
    types: { [fqn: string]: TypeMetadata }
  ) {
    const visited = new Set<string>();
    const errors: { [valueId: string]: ValueError[] } = {};
    this.validateIntl(root, values, errors, types, visited);

    return errors;
  }

  static validateIntl(
    value: CoreValue,
    values: { [valueId: string]: ValueMetadata },
    errors: { [valueId: string]: ValueError[] },
    types: { [fqn: string]: TypeMetadata },
    visited: Set<string>
  ) {
    if (visited.has(value.valueId)) return;
    visited.add(value.valueId);
    const valueErrors: ValueError[] = [];

    if (Values.isRef(value)) {
      const refItem = values[value.refValueId];

      this.validateIntl(refItem.value, values, errors, types, visited);
      const refItemErrors = errors[refItem.valueId] || [];
      valueErrors.push(...refItemErrors);
    } else if (TypeTest.isFqn(value.valueType)) {
      let required: (PropertyMetadata | ParameterMetadata)[] = [];
      let optional: (PropertyMetadata | ParameterMetadata)[] = [];
      let path: string[] = [];

      if (
        Values.isObject(value) ||
        Values.isInstance(value) ||
        Values.isCall(value)
      ) {
        const result = itemsHelper.getItems(types, value);

        if (!result) {
          throw new Error(`Could not getItems for ${value.valueId}`);
        }

        required = result.required;
        optional = result.optional;
        path = result.path;
      }

      for (const item of [...required, ...optional]) {
        const { currentValue } = valuesHelper.getPropertyValue(
          value,
          item.name,
          path
        );

        const hasValue = typeof currentValue !== "undefined";

        if (!item.optional && !hasValue) {
          valueErrors.push({
            key: item.name,
            valueId: "",
          });
        }

        if (hasValue) {
          this.validateIntl(currentValue, values, errors, types, visited);
          if ((errors[currentValue.valueId] || []).length > 0) {
            valueErrors.push({
              key: item.name,
              valueId: currentValue.valueId,
            });
          }
        }
      }

      if (Values.isInstance(value)) {
        for (const item of value.children) {
          this.validateIntl(item, values, errors, types, visited);

          if ((errors[item.valueId] || []).length > 0) {
            valueErrors.push({ key: "", valueId: item.valueId });
          }
        }
      }
    } else if (Values.isArray(value)) {
      if (value.items.length === 0) {
        valueErrors.push({ key: "", valueId: "" });
      } else {
        for (const item of value.items) {
          this.validateIntl(item, values, errors, types, visited);

          if ((errors[item.valueId] || []).length > 0) {
            valueErrors.push({ key: "", valueId: item.valueId });
          }
        }
      }
    } else if (Values.isMap(value)) {
      const mapValues = Object.values(value.pairs);
      if (mapValues.length === 0) {
        valueErrors.push({ key: "", valueId: "" });
      } else {
        for (const item of mapValues) {
          this.validateIntl(item, values, errors, types, visited);

          if ((errors[item.valueId] || []).length > 0) {
            valueErrors.push({ key: "", valueId: item.valueId });
          }
        }
      }
    }

    errors[value.valueId] = valueErrors;
    return valueErrors;
  }
}
