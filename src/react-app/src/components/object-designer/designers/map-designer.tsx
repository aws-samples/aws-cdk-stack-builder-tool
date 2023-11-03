import React, { useCallback, useContext, useState } from "react";
import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { SetValueAction } from "../../../project/actions";
import { ProjectContext } from "../../../project/project-context";
import { ProjectActionKind } from "../../../project/types";
import { Type, TypeTest } from "../../../types";
import { PropertyValue } from "../property-value";
import { BlurInput } from "../../blur-input";
import { CoreValue, Values } from "../../../project/types/values";
import { Utils } from "../../../utils";

export function MapDesigner(props: {
  modal: boolean;
  elementType: Type;
  parent: CoreValue;
}) {
  const { state, dispatch } = useContext(ProjectContext);
  const [currentValue, setCurrentValue] = useState<SetValueAction>();
  const [key, setKey] = useState("");
  const defaultValue = "not defined";

  const setValue = (action: SetValueAction) => {
    if (!action.payload.value) {
      setCurrentValue(undefined);
    } else {
      setCurrentValue(action);
    }
  };

  const onKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      setKey(value);
    },
    [setKey]
  );

  const onAddValueClick = useCallback(() => {
    if (!currentValue || key.length === 0) return;
    currentValue.payload.key = key;

    dispatch(currentValue);
    setCurrentValue(undefined);
    setKey("");
  }, [currentValue, dispatch, key]);

  const onKeyKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        onAddValueClick();
      }
    },
    [onAddValueClick]
  );

  const onRemoveClick = useCallback(
    (key: string, value: CoreValue) => {
      dispatch({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key,
          path: [],
          oldValue: value,
        },
      });

      setCurrentValue(undefined);
    },
    [dispatch]
  );

  const onKeyValueChange = useCallback(
    (key: string, oldKey: string, value: CoreValue) => {
      dispatch({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: oldKey,
          path: [],
        },
      });

      dispatch({
        kind: ProjectActionKind.SET_VALUE,
        payload: {
          key: key,
          path: [],
          value,
        },
      });
    },
    [dispatch]
  );

  if (!Values.isMap(props.parent)) return null;
  const hasValue = typeof currentValue !== "undefined";
  const pairs = props.parent.pairs;
  const keys = Object.keys(pairs).sort();
  const values = Object.values(pairs);
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
            Add Key and Value
          </span>
        </div>
      </div>
      <div
        className={Utils.classNames(
          "px-2 grid gap-2",
          isPrimitive ? "grid-cols-[300px_1fr_auto]" : "grid-cols-[0.5fr_1fr]"
        )}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Key
          </label>
          <input
            type="text"
            name="property-key"
            autoComplete="off"
            maxLength={100}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
            value={key}
            onChange={onKeyChange}
            onKeyDown={onKeyKeyDown}
          />
        </div>
        <div className={Utils.classNames(isPrimitive ? "col-span-2" : "")}>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Value
          </label>
          <PropertyValue
            setValue={setValue}
            onReturn={onAddValueClick}
            indirect={true}
            key={`${values.length}`}
            keyName={"any"}
            type={props.elementType}
            defaultValue={defaultValue}
            currentValue={currentValue?.payload.value}
            errors={[]}
            path={[]}
          />
        </div>
      </div>
      <div className="px-2 mb-1 mt-1 text-right">
        <button
          type="button"
          className={Utils.classNames(
            "inline-flex items-center px-3 py-2 bordertext-sm leading-4 font-medium rounded-md shadow-sm",
            hasValue && key.length > 0
              ? "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              : "border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
          onClick={onAddValueClick}
          disabled={!hasValue || key.length === 0}
        >
          Add Key and Value
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
      {values.length === 0 && (
        <div className="px-2">
          <h3 className="text-base leading-6 font-medium text-gray-700">
            No key value pairs added yet
          </h3>
        </div>
      )}
      <div
        className={Utils.classNames(
          "px-2 py-1 grid gap-2 items-center",
          isPrimitive ? "grid-cols-[300px_1fr_auto]" : "grid-cols-[0.5fr_1fr]"
        )}
      >
        {keys.map((key) => (
          <React.Fragment key={key}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Key
              </label>
              <BlurInput
                type="text"
                name={`property-${key}`}
                restoreIfEmpty={true}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(value) => onKeyValueChange(value, key, pairs[key])}
                value={key}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Value
              </label>
              <PropertyValue
                setValue={dispatch}
                key={key}
                keyName={key}
                type={props.elementType}
                currentValue={pairs[key]}
                defaultValue={defaultValue}
                errors={state.computed.errors[pairs[key].valueId]}
                path={[]}
              />
            </div>
            {isPrimitive && (
              <div>
                <button
                  type="button"
                  className="mt-5 pt-2 inline-flex items-center border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => onRemoveClick(key, pairs[key])}
                >
                  <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
