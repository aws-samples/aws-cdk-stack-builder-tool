import { useCallback } from "react";
import { ProjectActionKind } from "../../../project/types";
import { SetValueAction } from "../../../project/actions";
import { ValueError } from "../../../project/validator";
import { CoreValue, ValueKind, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function BooleanProperty(props: {
  setValue: (action: SetValueAction) => void;
  keyName?: string;
  path: string[];
  currentValue?: CoreValue;
  defaultValue: string;
  errors: ValueError[];
  indirect?: boolean;
}) {
  const hasErrors = props.errors.length > 0;

  const onChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      const value = (event.target as HTMLSelectElement).value;

      let boolValue: boolean | undefined = undefined;
      if (value === "true") boolValue = true;
      else if (value === "false") boolValue = false;

      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          oldValue: props.currentValue,
          value:
            typeof boolValue !== "undefined"
              ? {
                  kind: ValueKind.Primitive,
                  valueId: props.currentValue
                    ? props.currentValue.valueId
                    : Utils.generateId(),
                  valueType: {
                    primitive: "boolean",
                  },
                  value: boolValue,
                }
              : undefined,
        },
      });
    },
    [props]
  );

  let value = "";
  if (
    props.currentValue &&
    Values.isPrimitive(props.currentValue) &&
    typeof props.currentValue.value === "boolean"
  ) {
    value = props.currentValue.value.toString();
  }

  return (
    <select
      name={`property-${props.keyName}`}
      className={Utils.classNames(
        "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
        hasErrors
          ? "border-red-500"
          : typeof props.currentValue !== "undefined" && !props.indirect
          ? "border-emerald-500"
          : "border-gray-300"
      )}
      value={value}
      onChange={onChange}
    >
      <option disabled={true}>Default</option>
      <option value="">{props.defaultValue}</option>
      <option disabled={true}>Explicit</option>
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
}
