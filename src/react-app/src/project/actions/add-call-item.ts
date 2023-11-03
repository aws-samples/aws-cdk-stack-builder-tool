import { ProjectAction, ProjectActionKind, ProjectState } from "../types";
import { CallValue, Values } from "../types/values";
import { postProcess } from "../post-process";
import { TypeTest } from "../../types";
import { ValuesHelper } from "../helpers/values-helper";

const valuesHelper = new ValuesHelper();

export interface AddCallItemAction {
  kind: ProjectActionKind.ADD_CALL_ITEM;
  payload: {
    select: boolean;
    value: CallValue;
  };
}

export function isAddCallItemAction(
  action: ProjectAction
): action is AddCallItemAction {
  return action.kind === ProjectActionKind.ADD_CALL_ITEM;
}

export function addCallItem(
  state: ProjectState,
  action: AddCallItemAction
): ProjectState {
  const { select, value } = action.payload;
  let container = state.computed.selectedContainer;
  let index = container.children.length;
  if (container.valueId !== state.root.valueId) {
    if (value.methodOfId === container.valueId) {
      const patentId = state.computed.values[container.valueId].parentId;
      const parentValue = state.computed.values[patentId].value;
      if (Values.isInstance(parentValue)) {
        container = parentValue;
      }
      index = container.children.indexOf(state.computed.selectedContainer);
    } else {
      index = container.children.indexOf(
        state.computed.selectedRootValue.value
      );
    }
  }

  const valueName = valuesHelper.generateValueName(
    container.children,
    TypeTest.isFqn(value.valueType) && state.types[value.valueType.fqn]
      ? state.types[value.valueType.fqn].name
      : value.method
  );

  value.valueName = valueName;

  let retValue: ProjectState | null = null;
  if (state.root.valueId === container.valueId) {
    const children = [...state.root.children];
    children.splice(index + 1, 0, value);

    retValue = {
      ...state,
      root: {
        ...state.root,
        children,
      },
    };
  } else {
    retValue = {
      ...state,
    };

    const valueMetadata = state.computed.values[container.valueId];
    const parent = state.computed.values[valueMetadata.parentId];
    if (Values.isInstance(parent.value)) {
      const parentContainer = parent.value;
      parentContainer.children = parentContainer.children.map((item) => {
        if (item.valueId !== container.valueId) {
          return item;
        }

        const children = [...container.children];
        children.splice(index + 1, 0, value);

        return {
          ...item,
          children,
        };
      });
    }
  }

  if (select && value) {
    retValue.selectionIds = [
      ...retValue.selectionIds.slice(0, -1),
      value.valueId,
    ];
    retValue.modal = false;
  }

  postProcess(retValue);

  return retValue;
}
