import {
  RectangleStackIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { CollectionType } from "../../../types";
import { useContext, useCallback } from "react";
import { ProjectContext } from "../../../project/project-context";
import { ProjectActionKind } from "../../../project/types";
import { SetValueAction } from "../../../project/actions";
import { ValueError } from "../../../project/validator";
import { CoreValue, ValueKind, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function MapProperty(props: {
  setValue: (action: SetValueAction) => void;
  keyName?: string;
  path: string[];
  currentValue?: CoreValue;
  defaultValue: string;
  type: CollectionType;
  errors: ValueError[];
  indirect?: boolean;
}) {
  const { dispatch } = useContext(ProjectContext);
  const hasErrors = props.errors.length > 0;

  const onRemove = useCallback(() => {
    if (window.confirm("Do you want to remove property value?")) {
      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
        },
      });
    }
  }, [props]);

  const onEdit = useCallback(() => {
    if (props.currentValue) {
      dispatch({
        kind: ProjectActionKind.TOGGLE_SELECT,
        payload: {
          valueId: props.currentValue.valueId,
        },
      });
    } else {
      props.setValue({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: props.keyName,
          path: props.path,
          select: true,
          oldValue: props.currentValue,
          value: {
            kind: ValueKind.Map,
            valueId: Utils.generateId(),
            valueType: props.type,
            pairs: {},
          },
        },
      });
    }
  }, [dispatch, props]);

  if (props.currentValue && !Values.isMap(props.currentValue)) return null;

  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <RectangleStackIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name={`property-${props.keyName}`}
          autoComplete="off"
          className={Utils.classNames(
            "cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300",
            hasErrors
              ? "border-red-500"
              : typeof props.currentValue !== "undefined" && !props.indirect
              ? "border-emerald-500"
              : "border-gray-300"
          )}
          readOnly={true}
          placeholder={props.defaultValue}
          value={
            typeof props.currentValue !== "undefined"
              ? `${Object.keys(props.currentValue.pairs).length} items`
              : ""
          }
          onClick={onEdit}
        />
      </div>
      <span className="relative z-0 inline-flex shadow-sm rounded-md">
        {typeof props.currentValue !== "undefined" && (
          <button
            type="button"
            className={Utils.classNames(
              "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-20",
              hasErrors
                ? "border-red-500"
                : typeof props.currentValue !== "undefined" && !props.indirect
                ? "border-emerald-500"
                : "border-gray-300"
            )}
            onClick={onRemove}
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className={Utils.classNames(
            "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-l-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10",
            hasErrors
              ? "border-red-500"
              : typeof props.currentValue !== "undefined" && !props.indirect
              ? "border-emerald-500"
              : "border-gray-300"
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
