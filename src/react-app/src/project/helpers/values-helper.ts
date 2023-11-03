import { DocsMetadata, TypeMetadata, TypeTest } from "../../types";
import { CoreValue, ValueKind, Values } from "../types/values";
import { Utils } from "../../utils";
import { ItemsHelper } from "./items-helper";

export class ValuesHelper {
  private itemsHelper = new ItemsHelper();

  generateValueName(values: CoreValue[], name: string) {
    name = Utils.firstLetterToUpperCase(name);
    let valueName = "";
    let i = 1;

    while (true) {
      let current = `${name}${i}`;
      i++;

      if (
        !values.find((value) => {
          return (
            value.valueName?.toLocaleLowerCase() === current.toLocaleLowerCase()
          );
        })
      ) {
        valueName = current;
        break;
      }

      if (i > 10000) break;
    }

    return valueName;
  }

  resolvePropertyPath(
    types: {
      [fqn: string]: TypeMetadata;
    },
    path: string[] | undefined,
    value: CoreValue
  ) {
    const valuePath = [value];
    if (!path || path.length === 0) {
      return valuePath;
    }

    let current = value;
    for (let key of path) {
      let child: CoreValue | null = null;
      if (Values.isInstance(current)) {
        child = current.parameters[key];
      } else if (Values.isObject(current)) {
        child = current.properties[key];
      } else if (Values.isCall(current)) {
        child = current.parameters[key];
      }

      if (child) {
        current = child;
        valuePath.push(child);
      } else {
        const all = this.itemsHelper.getAllItems(types, current);
        const item = all.find((c) => c.name === key);
        if (!item) {
          throw new Error(`Key ${key} not found in ${current.valueType}`);
        }

        if (!TypeTest.isFqn(item.type)) {
          throw new Error(`Key ${key} is not a fqn in ${current.valueType}`);
        }

        const typeMetadata = types[item.type.fqn];
        let newValue: CoreValue | null = null;

        if (typeMetadata.kind === "class") {
          newValue = {
            kind: ValueKind.Instance,
            valueId: Utils.generateId(),
            valueType: item.type,
            parameters: {},
            children: [],
          };
        } else if (typeMetadata.kind === "interface") {
          newValue = {
            kind: ValueKind.Object,
            valueId: Utils.generateId(),
            valueType: item.type,
            properties: {},
          };
        }

        if (!newValue) {
          throw new Error(`Type ${item.type.fqn} not supported`);
        }

        if (Values.isInstance(current)) {
          current.parameters[key] = newValue;
        } else if (Values.isObject(current)) {
          current.properties[key] = newValue;
        } else if (Values.isCall(current)) {
          current.parameters[key] = newValue;
        }

        current = newValue;
        valuePath.push(newValue);
      }
    }

    return valuePath;
  }

  setSubValue(
    valuePath: CoreValue[],
    key?: string,
    value?: CoreValue,
    oldValue?: CoreValue
  ) {
    if (valuePath.length === 0) {
      throw new Error("Parent is required");
    }

    const last = valuePath[valuePath.length - 1];
    const isUndefined = typeof value === "undefined";

    if (key) {
      if (Values.isObject(last)) {
        if (isUndefined) {
          delete last.properties[key];
        } else {
          last.properties[key] = value;
        }
      } else if (Values.isInstance(last)) {
        if (isUndefined) {
          delete last.parameters[key];
        } else {
          last.parameters[key] = value;
        }
      } else if (Values.isCall(last)) {
        if (isUndefined) {
          delete last.parameters[key];
        } else {
          last.parameters[key] = value;
        }
      } else if (Values.isMap(last)) {
        if (isUndefined) {
          delete last.pairs[key];
        } else {
          last.pairs[key] = value;
        }
      } else {
        throw new Error("Unsupported value type");
      }
    } else {
      if (Values.isArray(last)) {
        let values = [...last.items];

        if (isUndefined) {
          values = values.filter((c) => c.valueId !== oldValue?.valueId);
        } else {
          const index = last.items.findIndex(
            (c) => c.valueId === value.valueId
          );

          if (index >= 0) {
            values[index] = value;
          } else {
            values.push(value);
          }
        }

        last.items = values;
      } else {
        throw new Error("Unsupported value type");
      }
    }
  }

  clearValuePath(valuePath: CoreValue[]) {
    if (valuePath.length <= 1) return;

    for (let idx = valuePath.length - 1; idx > 0; idx--) {
      const current = valuePath[idx];
      let isEmpty = false;

      if (
        Values.isObject(current) &&
        Object.keys(current.properties).length === 0
      ) {
        isEmpty = true;
      } else if (
        (Values.isInstance(current) || Values.isCall(current)) &&
        Object.keys(current.parameters).length === 0
      ) {
        isEmpty = true;
      }

      if (!isEmpty) {
        break;
      }

      const prev = valuePath[idx - 1];
      if (Values.isObject(prev)) {
        for (let key of Object.keys(prev.properties)) {
          if (prev.properties[key].valueId === current.valueId) {
            delete prev.properties[key];
            break;
          }
        }
      }

      if (Values.isInstance(prev) || Values.isCall(prev)) {
        for (let key of Object.keys(prev.parameters)) {
          if (prev.parameters[key].valueId === current.valueId) {
            delete prev.parameters[key];
            break;
          }
        }
      }
    }
  }

  getPropertyValue(parent: CoreValue, key: string, path: string[]) {
    let currentValue: CoreValue | undefined = undefined;

    let current = parent;
    for (let key of path) {
      let child: CoreValue | null = null;
      if (Values.isInstance(current)) {
        child = current.parameters[key];
      } else if (Values.isObject(current)) {
        child = current.properties[key];
      } else if (Values.isCall(current)) {
        child = current.parameters[key];
      }

      if (child) {
        current = child;
      } else {
        return { current, currentValue };
      }
    }

    if (Values.isObject(current)) {
      currentValue = current.properties[key];
    } else if (Values.isInstance(current)) {
      currentValue = current.parameters[key];
    } else if (Values.isCall(current)) {
      currentValue = current.parameters[key];
    } else if (Values.isMap(current)) {
      currentValue = current.pairs[key];
    }

    return { current, currentValue };
  }

  getPropertyDefaultValue(docs: DocsMetadata | undefined, limit: number = 45) {
    let defaultValue = docs?.default || "not defined";
    if (defaultValue.endsWith(".")) {
      defaultValue = defaultValue.substring(0, defaultValue.length - 1);
    }

    if (defaultValue.length > limit) {
      defaultValue = defaultValue.slice(0, limit) + "...";
    }

    return defaultValue;
  }
}
