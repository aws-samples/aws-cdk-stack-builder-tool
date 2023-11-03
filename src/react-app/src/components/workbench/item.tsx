import React, { useCallback, useContext } from "react";
import {
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { FolderIcon } from "@heroicons/react/24/outline";
import { ProjectContext } from "../../project/project-context";
import { ProjectActionKind } from "../../project/types";
import { CoreValue } from "../../project/types/values";
import { Utils } from "../../utils";
import { TypesHelper } from "../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

export function Item(props: {
  value: CoreValue;
  total: number;
  index: number;
}) {
  const { state, dispatch } = useContext(ProjectContext);

  const isLast = props.index === props.total - 1;
  const isFirst = props.index === 0;
  const isSelected = state.selectionIds.includes(props.value.valueId);
  const hasErrors = state.computed.errors[props.value.valueId]?.length > 0;

  const onRemoveItem = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        kind: ProjectActionKind.REMOVE_ITEM,
        payload: {
          valueId: props.value.valueId,
        },
      });
    },
    [dispatch, props.value.valueId]
  );

  const onMoveItemUp = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        kind: ProjectActionKind.MOVE_ITEM,
        payload: {
          valueId: props.value.valueId,
          index: props.index - 1,
        },
      });
    },
    [dispatch, props.index, props.value.valueId]
  );

  const onMoveItemDown = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        kind: ProjectActionKind.MOVE_ITEM,
        payload: {
          valueId: props.value.valueId,
          index: props.index + 1,
        },
      });
    },
    [dispatch, props.index, props.value.valueId]
  );

  const onToggleSelect = useCallback(() => {
    dispatch({
      kind: ProjectActionKind.TOGGLE_SELECT,
      payload: {
        valueId: props.value.valueId,
      },
    });
  }, [dispatch, props.value.valueId]);

  const isContainer = typesHelper.isContainerType(
    state.types,
    state.blueprintComputed,
    props.value.valueType
  );

  const typeName = typesHelper.getTypeName(state, props.value);

  return (
    <div
      className={Utils.classNames(
        "transition-colors min-w-[500px] mx-4 my-4 p-6 shadow relative rounded-lg border hover:bg-gray-50 cursor-pointer",
        isSelected ? "bg-indigo-50 hover:bg-indigo-50" : "bg-white",
        hasErrors
          ? "border-red-500"
          : isSelected
          ? "border-indigo-300"
          : "border-gray-300"
      )}
      onClick={onToggleSelect}
    >
      <div className="flex justify-between items-center">
        <div className="truncate">
          <span className="truncate flex flex-row items-center">
            {isContainer ? (
              <>
                <FolderIcon className="w-5 h-5" />
                &nbsp;{props.value.valueName}
              </>
            ) : (
              props.value.valueName
            )}
          </span>
          <div className="text-gray-500 text-sm">{typeName}</div>
        </div>
        <div>
          <button
            type="button"
            className={Utils.classNames(
              isFirst ? "text-gray-400" : "text-gray-700 hover:bg-gray-200 ",
              "inline-flex items-center p-1 mr-2 border border-transparent rounded-full focus:outline-none"
            )}
            onClick={onMoveItemUp}
            disabled={isFirst}
          >
            <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={Utils.classNames(
              isLast ? "text-gray-400" : "text-gray-700 hover:bg-gray-200 ",
              "inline-flex items-center p-1 mr-2 border border-transparent rounded-full focus:outline-none"
            )}
            onClick={onMoveItemDown}
            disabled={isLast}
          >
            <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow text-gray-700 hover:bg-gray-200 focus:outline-none"
            onClick={onRemoveItem}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
