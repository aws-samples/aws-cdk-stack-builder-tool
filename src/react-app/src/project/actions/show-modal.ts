import { ProjectAction, ProjectActionKind, ProjectState } from "../types";

export interface ShowModalAction {
  kind: ProjectActionKind.SHOW_MODAL;
  payload: {
    show: boolean;
  };
}

export function isShowModalAction(
  action: ProjectAction
): action is ShowModalAction {
  return action.kind === ProjectActionKind.SHOW_MODAL;
}

export function showModal(
  state: ProjectState,
  action: ShowModalAction
): ProjectState {
  let { show } = action.payload;

  let retValue: ProjectState = {
    ...state,
    modal: show,
  };

  return retValue;
}
