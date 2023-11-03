import {
  ProjectAction,
  ProjectActionKind,
  ProjectState,
  ValueMetadata,
  Values,
} from "../types";
import { postProcess } from "../post-process";

export interface RemoveItemUpAction {
  kind: ProjectActionKind.REMOVE_ITEM;
  payload: {
    valueId: string;
  };
}

export function isRemoveItemUpAction(
  action: ProjectAction
): action is RemoveItemUpAction {
  return action.kind === ProjectActionKind.REMOVE_ITEM;
}

export function removeItem(
  state: ProjectState,
  action: RemoveItemUpAction
): ProjectState {
  const { valueId } = action.payload;
  const { selectedContainer } = state.computed;
  selectedContainer.children = selectedContainer.children.filter(
    (c) => c.valueId !== valueId
  );

  const removedIds = removeDependencies(state, valueId);
  let selectionIds = [...state.selectionIds];
  for (let i = 0; i < selectionIds.length; i++) {
    const current = selectionIds[i];
    if (valueId === current || removedIds.includes(current)) {
      selectionIds = selectionIds.slice(0, i);
      break;
    }
  }

  const retValue: ProjectState = {
    ...state,
    selectionIds,
  };

  postProcess(retValue);

  return retValue;
}

function removeDependencies(state: ProjectState, valueId: string) {
  const removedIds: string[] = [];

  for (const item of Object.values(state.computed.values)) {
    if (
      (Values.isRef(item.value) && item.value.refValueId === valueId) ||
      (Values.isCall(item.value) && item.value.methodOfId === valueId)
    ) {
      const parent = state.computed.values[item.parentId];
      removedIds.push(...removeDependencies(state, item.valueId));
      removeFromParent(parent, item);
      removedIds.push(item.valueId);
    }
  }

  return removedIds;
}

function removeFromParent(parent: ValueMetadata, item: ValueMetadata) {
  if (Values.isObject(parent.value)) {
    delete parent.value.properties[item.parentKey];
  } else if (Values.isInstance(parent.value)) {
    delete parent.value.parameters[item.parentKey];
    parent.value.children = parent.value.children.filter(
      (c) => c.valueId !== item.valueId
    );
  } else if (Values.isCall(parent.value)) {
    delete parent.value.parameters[item.parentKey];
  } else if (Values.isArray(parent.value)) {
    parent.value.items = parent.value.items.filter(
      (c) => c.valueId !== item.valueId
    );
  } else if (Values.isMap(parent.value)) {
    delete parent.value.pairs[item.parentKey];
  }
}
