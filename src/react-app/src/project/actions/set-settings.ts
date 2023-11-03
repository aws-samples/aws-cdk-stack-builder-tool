import { postProcess } from "../post-process";
import { ProjectAction, ProjectActionKind, ProjectState } from "../types";

type ProjectSettings =
  | {
      kind: "language";
      language: "typescript";
    }
  | {
      kind: "directoryHandle";
      directoryHandle: FileSystemDirectoryHandle | null;
    };

export interface SetSettingsAction {
  kind: ProjectActionKind.SET_SETTINGS;
  payload: ProjectSettings[];
}

export function isSetSettingsAction(
  action: ProjectAction
): action is SetSettingsAction {
  return action.kind === ProjectActionKind.SET_SETTINGS;
}

export function setSettings(
  state: ProjectState,
  action: SetSettingsAction
): ProjectState {
  const { payload } = action;
  const settings = { ...state.settings };

  for (const item of payload) {
    switch (item.kind) {
      case "language": {
        settings.language = item.language;
        break;
      }
      case "directoryHandle": {
        settings.directoryHandle = item.directoryHandle;
        break;
      }
    }
  }

  let retValue: ProjectState = {
    ...state,
    settings,
  };

  postProcess(retValue);

  return retValue;
}
