import { ProjectAction, ProjectActionKind, ProjectState } from "../types";
import { postProcess } from "../post-process";

export interface SetConstructIdAction {
  kind: ProjectActionKind.SET_CONSTRUCT_ID;
  payload: {
    valueId: string;
    valueName: string;
  };
}

export function isSetConstructIdAction(
  action: ProjectAction
): action is SetConstructIdAction {
  return action.kind === ProjectActionKind.SET_CONSTRUCT_ID;
}

export function setConstructId(
  state: ProjectState,
  action: SetConstructIdAction
): ProjectState {
  const { valueId, valueName } = action.payload;
  const item = state.computed.values[valueId];

  if (!item) return state;
  item.value.valueName = valueName.trim();

  const retValue: ProjectState = {
    ...state,
  };

  postProcess(retValue);

  return retValue;
}
