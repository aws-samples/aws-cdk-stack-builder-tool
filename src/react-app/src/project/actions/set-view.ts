import { ProjectAction, ProjectActionKind, ProjectState } from "../types";

export interface SetViewAction {
  kind: ProjectActionKind.SET_VIEW;
  payload: {
    view: string;
  };
}

export function isSetViewAction(
  action: ProjectAction
): action is SetViewAction {
  return action.kind === ProjectActionKind.SET_VIEW;
}

export function setView(
  state: ProjectState,
  action: SetViewAction
): ProjectState {
  const { view } = action.payload;

  const retValue: ProjectState = {
    ...state,
    view,
  };

  return retValue;
}
