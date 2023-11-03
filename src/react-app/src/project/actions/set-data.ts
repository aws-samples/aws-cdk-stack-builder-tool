import { postProcess } from "../post-process";
import { AssemblyMetadata, TypeMetadata } from "../../types";
import {
  ProjectAction,
  ProjectActionKind,
  BlueprintComputed,
  ProjectState,
  StorageV1Data,
} from "../types";

export interface SetDataAction {
  kind: ProjectActionKind.SET_DATA;
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
    project: StorageV1Data;
    blueprintComputed: BlueprintComputed;
  };
}

export function isSetDataAction(
  action: ProjectAction
): action is SetDataAction {
  return action.kind === ProjectActionKind.SET_DATA;
}

export function setData(
  state: ProjectState,
  action: SetDataAction
): ProjectState {
  const { project, blueprintComputed } = action.payload;

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
    ...project,
    blueprintComputed,
  };

  postProcess(retValue);
  retValue.loaded = true;

  return retValue;
}
