import { postProcess } from "../post-process";
import { AssemblyMetadata, TypeMetadata } from "../../types";
import { ProjectAction, ProjectActionKind, ProjectState } from "../types";

export interface UpdateDataAction {
  kind: ProjectActionKind.UPDATE_DATA;
  payload: {
    version: string;
    assemblies: AssemblyMetadata[];
    typeMetadata: {
      [fqn: string]: TypeMetadata;
    };
    modules: {
      [name: string]: TypeMetadata[];
    };
    constructFqns: Set<string>;
    libs: { [key: string]: string };
  };
}

export function isUpdateDataAction(
  action: ProjectAction
): action is UpdateDataAction {
  return action.kind === ProjectActionKind.UPDATE_DATA;
}

export function updateData(
  state: ProjectState,
  action: UpdateDataAction
): ProjectState {
  const {
    typeMetadata,
    modules,
    constructFqns,
    assemblies = [],
    version,
  } = action.payload;

  let retValue: ProjectState = {
    ...state,
    version,
    assemblies,
    types: typeMetadata,
    modules,
    constructFqns,
    blueprintComputed: {
      ...state.blueprintComputed,
      libs: { ...state.blueprintComputed.libs, ...action.payload.libs },
    },
    libs: { ...state.libs, ...action.payload.libs },
  };

  postProcess(retValue);
  retValue.loaded = true;

  return retValue;
}
