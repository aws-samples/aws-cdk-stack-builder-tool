import { useCallback } from "react";
import { ProjectActionKind } from "../../../project/types";
import { BlurInput } from "../../blur-input";
import { SetValueAction } from "../../../project/actions";
import { ValueError } from "../../../project/validator";
import { CoreValue, ValueKind, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function NumberProperty(props: {
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
      let numberValue: number | undefined = undefined;

      const parseResult = parseInt(value, 10);
      if (!isNaN(parseResult)) {
        numberValue = parseResult;
      }

      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          oldValue: props.currentValue,
          value:
            typeof numberValue !== "undefined"
              ? {
                  kind: ValueKind.Primitive,
                  valueId: props.currentValue
                    ? props.currentValue.valueId
                    : Utils.generateId(),
                  valueType: {
                    primitive: "number",
                  },
                  value: numberValue,
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
    typeof props.currentValue.value === "number"
  ) {
    value = props.currentValue.value.toString();
  }

  return (
    <BlurInput
      type="number"
      name={`property-${props.keyName}`}
      className={Utils.classNames(
        "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md",
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
      trim={true}
      emitKeyStrokes={props.indirect}
    />
  );
}
