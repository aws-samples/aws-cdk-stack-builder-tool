import { ProjectAction, ProjectActionKind, ProjectState } from "../types";
import { InstanceValue, ValueKind, Values } from "../types/values";
import { postProcess } from "../post-process";
import { Utils } from "../../utils";
import { ValuesHelper } from "../helpers/values-helper";

const valuesHelper = new ValuesHelper();

export interface AddItemAction {
  kind: ProjectActionKind.ADD_ITEM;
  payload: {
    fqn: string;
  };
}

export function isAddItemAction(
  action: ProjectAction
): action is AddItemAction {
  return action.kind === ProjectActionKind.ADD_ITEM;
}

export function addItem(
  state: ProjectState,
  action: AddItemAction
): ProjectState {
  const { fqn } = action.payload;
  const { values, selectedContainer } = state.computed;
  const typeMetadata = state.types[fqn];
  const valueName = valuesHelper.generateValueName(
    selectedContainer.children,
    typeMetadata.name
  );

  const value: InstanceValue = {
    kind: ValueKind.Instance,
    valueId: Utils.generateId(),
    valueName,
    valueType: {
      fqn,
    },
    children: [],
    parameters: {},
  };

  let retValue: ProjectState | null = null;
  if (state.root.valueId === selectedContainer.valueId) {
    retValue = {
      ...state,
      root: {
        ...state.root,
        children: [...state.root.children, value],
      },
    };
  } else {
    retValue = {
      ...state,
    };

    const valueMetadata = values[selectedContainer.valueId];
    const parent = values[valueMetadata.parentId];
    if (Values.isInstance(parent.value)) {
      const parentContainer = parent.value;
      parentContainer.children = parentContainer.children.map((item) => {
        if (item.valueId !== selectedContainer.valueId) {
          return item;
        }

        return {
          ...item,
          children: [...selectedContainer.children, value],
        };
      });
    }
  }

  postProcess(retValue);

  return retValue;
}
