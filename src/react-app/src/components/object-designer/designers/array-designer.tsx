import React, { useCallback, useContext, useState } from "react";
import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { SetValueAction } from "../../../project/actions";
import { ProjectContext } from "../../../project/project-context";
import { ProjectActionKind } from "../../../project/types";
import { Type, TypeTest } from "../../../types";
import { PropertyValue } from "../property-value";
import { CoreValue, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function ArrayDesigner(props: {
  modal: boolean;
  elementType: Type;
  parent: CoreValue;
}) {
  const { state, dispatch } = useContext(ProjectContext);
  const [currentValue, setCurrentValue] = useState<SetValueAction>();
  const defaultValue = "not defined";

  const setValue = (action: SetValueAction) => {
    if (!action.payload.value) {
      setCurrentValue(undefined);
    } else {
      setCurrentValue(action);
    }
  };

  const onAddValueClick = useCallback(() => {
    if (!currentValue) return;
    dispatch(currentValue);
    setCurrentValue(undefined);
  }, [currentValue, dispatch]);

  const onRemoveClick = useCallback(
    (value: CoreValue) => {
      dispatch({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          path: [],
          oldValue: value,
        },
      });
      setCurrentValue(undefined);
    },
    [dispatch]
  );

  if (!Values.isArray(props.parent)) return null;
  const hasValue = typeof currentValue !== "undefined";
  const isPrimitive = TypeTest.isPrimitive(props.elementType);

  return (
    <div className="flex flex-col items-stretch gap-3 pb-8 pt-2">
      <div className="relative col-span-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span
            className={Utils.classNames(
              props.modal ? "bg-white" : "bg-gray-100",
              "px-3 text-gray-900"
            )}
          >
            Add Value
          </span>
        </div>
      </div>
      <div className="px-2 pt-1">
        <PropertyValue
          setValue={setValue}
          onReturn={onAddValueClick}
          indirect={true}
          type={props.elementType}
          defaultValue={defaultValue}
          currentValue={currentValue?.payload.value}
          path={[]}
          errors={[]}
        />
      </div>
      <div className="px-2 pb-1 text-right">
        <button
          type="button"
          className={Utils.classNames(
            "inline-flex items-center px-3 py-2 bordertext-sm leading-4 font-medium rounded-md shadow-sm",
            hasValue
              ? "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              : "border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
          onClick={onAddValueClick}
          disabled={!hasValue}
        >
          Add Value
        </button>
      </div>

      <div className="relative col-span-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span
            className={Utils.classNames(
              props.modal ? "bg-white" : "bg-gray-100",
              "px-3 text-gray-900"
            )}
          >
            Values
          </span>
        </div>
      </div>
      {props.parent.items.length === 0 && (
        <div className="px-2">
          <h3 className="text-base leading-6 font-medium text-gray-700">
            No values added yet
          </h3>
        </div>
      )}
      <div
        className={Utils.classNames(
          "px-2 py-1",
          isPrimitive ? "grid grid-cols-[1fr_auto] items-center" : ""
        )}
      >
        {props.parent.items.map((item) => (
          <React.Fragment key={item.valueId}>
            <PropertyValue
              setValue={dispatch}
              type={props.elementType}
              currentValue={item}
              defaultValue={defaultValue}
              errors={state.computed.errors[item.valueId]}
              path={[]}
            />
            {isPrimitive && (
              <button
                type="button"
                className="ml-2 pt-2 inline-flex items-center border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => onRemoveClick(item)}
              >
                <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
