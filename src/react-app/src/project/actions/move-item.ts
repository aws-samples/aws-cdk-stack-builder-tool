import { ProjectAction, ProjectActionKind, ProjectState } from "../types";
import { postProcess } from "../post-process";
import { Utils } from "../../utils";

export interface MoveItemAction {
  kind: ProjectActionKind.MOVE_ITEM;
  payload: {
    valueId: string;
    index: number;
  };
}

export function isMoveItemAction(
  action: ProjectAction
): action is MoveItemAction {
  return action.kind === ProjectActionKind.MOVE_ITEM;
}

export function moveItem(
  state: ProjectState,
  action: MoveItemAction
): ProjectState {
  const { valueId, index } = action.payload;
  const { selectedContainer } = state.computed;
  const value = selectedContainer.children.find((c) => c.valueId === valueId);
  if (!value) return state;

  const currentIndex = selectedContainer.children.indexOf(value);
  const delta = index - currentIndex;
  const items = Utils.moveArrayElement(
    [...selectedContainer.children],
    value,
    delta
  );
  selectedContainer.children = items;

  const retValue: ProjectState = {
    ...state,
  };

  postProcess(retValue);

  return retValue;
}
