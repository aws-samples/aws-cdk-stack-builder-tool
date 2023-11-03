import { useCallback } from "react";
import { ProjectActionKind } from "../../../project/types";
import { BlurInput } from "../../blur-input";
import { SetValueAction } from "../../../project/actions";
import { ValueError } from "../../../project/validator";
import { CoreValue, ValueKind, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function StringProperty(props: {
  keyName?: string;
  path: string[];
  currentValue?: CoreValue;
  defaultValue: string;
  errors: ValueError[];
  indirect?: boolean;
  setValue: (action: SetValueAction) => void;
  onReturn?: () => void;
}) {
  const hasErrors = props.errors.length > 0;

  const onChange = useCallback(
    (value: string) => {
      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          oldValue: props.currentValue,
          value:
            value && value.length > 0
              ? {
                  kind: ValueKind.Primitive,
                  valueId: props.currentValue
                    ? props.currentValue.valueId
                    : Utils.generateId(),
                  valueType: {
                    primitive: "string",
                  },
                  value,
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
    typeof props.currentValue.value === "string"
  ) {
    value = props.currentValue.value;
  }

  return (
    <BlurInput
      type="text"
      name={`property-${props.keyName}`}
      className={Utils.classNames(
        "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        hasErrors
          ? "border-red-500"
          : typeof props.currentValue !== "undefined" && !props.indirect
          ? "border-emerald-500"
          : "border-gray-300"
      )}
      onChange={onChange}
      onReturn={props.onReturn}
      value={value}
      placeholder={props.defaultValue}
      multiline={false}
      emitKeyStrokes={props.indirect}
    />
  );
}
