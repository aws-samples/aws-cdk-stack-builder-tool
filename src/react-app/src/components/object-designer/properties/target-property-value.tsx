import { useCallback, useContext } from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ProjectContext } from "../../../project/project-context";
import { ProjectActionKind } from "../../../project/types";
import { SetValueAction } from "../../../project/actions";
import { TypeTest } from "../../../types";
import { ValueError } from "../../../project/validator";
import { CoreValue, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function TargetPropertyValue(props: {
  setValue: (action: SetValueAction) => void;
  keyName?: string;
  path: string[];
  currentValue: CoreValue;
  errors: ValueError[];
}) {
  const { state, dispatch } = useContext(ProjectContext);
  const hasErrors = props.errors.length > 0;
  const valueId = Values.isRef(props.currentValue)
    ? props.currentValue.refValueId
    : props.currentValue.valueId;
  const valueMetadata = state.computed.values[valueId];
  const parent = state.computed.values[valueMetadata.parentId];

  const onRemove = useCallback(() => {
    if (window.confirm("Do you want to remove property value?")) {
      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          oldValue: props.currentValue,
        },
      });
    }
  }, [props]);

  const onEdit = useCallback(() => {
    dispatch({
      kind: ProjectActionKind.TOGGLE_SELECT,
      payload: {
        valueId: props.currentValue.valueId,
      },
    });
  }, [props.currentValue.valueId, dispatch]);

  let placeholder = "";
  if (TypeTest.isFqn(props.currentValue.valueType)) {
    if (Values.isCall(props.currentValue)) {
      if (!props.currentValue.methodOfId) {
        placeholder = state.types[props.currentValue.methodOfType.fqn].name;
      }
    } else {
      placeholder = state.types[props.currentValue.valueType.fqn].name;
    }
  }

  if (Values.isCall(props.currentValue)) {
    let methodPath = props.currentValue.methodPath.join(".");
    if (methodPath.length > 0) {
      methodPath = methodPath + ".";
    }

    placeholder = `${methodPath}${placeholder}${
      placeholder.length > 0 ? "." : ""
    }${props.currentValue.method}(...)`;
  } else if (Values.isRef(props.currentValue)) {
    const refValueId = props.currentValue.refValueId;
    const refValue = state.computed.values[refValueId];
    if (parent.value !== state.computed.selectedContainer) {
      placeholder = `${parent.valueName}.${refValue.valueName}`;
    } else {
      placeholder = refValue?.valueName || "";
    }
  }

  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <input
        type="text"
        name={`property-${props.keyName}`}
        className={Utils.classNames(
          "cursor-pointer block w-full rounded-none rounded-l-md sm:text-sm focus:ring-0 focus:ring-transparent",
          hasErrors
            ? "border-red-500 focus:border-red-500"
            : "border-emerald-500 focus:border-emerald-500"
        )}
        placeholder={placeholder}
        readOnly={true}
        onClick={onEdit}
      />
      <span className="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          type="button"
          className={Utils.classNames(
            "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-20",
            hasErrors ? "border-red-500" : "border-emerald-500"
          )}
          onClick={onRemove}
        >
          <XMarkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={Utils.classNames(
            "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-l-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10",
            hasErrors ? "border-red-500" : "border-emerald-500"
          )}
          onClick={onEdit}
        >
          <PencilSquareIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </span>
    </div>
  );
}
