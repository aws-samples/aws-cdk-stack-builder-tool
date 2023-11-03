import { useCallback, useContext } from "react";
import { ProjectContext } from "../../../project/project-context";
import { ProjectActionKind } from "../../../project/types";
import { FqnType } from "../../../types";
import { SetValueAction } from "../../../project/actions";
import { ValueError } from "../../../project/validator";
import { CoreValue, ValueKind, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function EnumProperty(props: {
  setValue: (action: SetValueAction) => void;
  keyName?: string;
  path: string[];
  currentValue?: CoreValue;
  defaultValue: string;
  type: FqnType;
  errors: ValueError[];
  indirect?: boolean;
}) {
  const { state } = useContext(ProjectContext);
  const hasErrors = props.errors.length > 0;
  const typeMetadata = state.types[props.type.fqn];

  const onChange = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      const value = (event.target as HTMLSelectElement).value;

      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          oldValue: props.currentValue,
          value:
            value && value.length > 0
              ? {
                  kind: ValueKind.Member,
                  valueId: props.currentValue
                    ? props.currentValue.valueId
                    : Utils.generateId(),
                  valueType: props.type,
                  member: value,
                }
              : undefined,
        },
      });
    },
    [props]
  );

  let value = "";
  if (props.currentValue && Values.isMember(props.currentValue)) {
    value = props.currentValue.member;
  }

  return (
    <select
      name={`property-${props.keyName}`}
      className={Utils.classNames(
        "mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
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
      <option disabled={true}>Values</option>
      {(typeMetadata.members || [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((key) => (
          <option key={key.name} value={key.name}>
            {typeMetadata.name}.{key.name}
          </option>
        ))}
    </select>
  );
}
