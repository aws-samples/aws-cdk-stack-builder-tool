import { AssemblyMetadata, TypeMetadata } from "../../types";
import { InstanceValue, ValueMetadata } from "./values";
import { ValueError } from "../validator";

export type CdkPlatform = "cdk" | "cdktf" | "cdk8s";

export interface ProjectState {
  version: string;
  loaded: boolean;
  metadata: ProjectMetadata;
  settings: ProjectSettings;
  blueprint: BlueprintMetadata;
  blueprintComputed: BlueprintComputed;
  root: InstanceValue;
  assemblies: AssemblyMetadata[];
  libs: { [key: string]: string };
  types: { [fqn: string]: TypeMetadata };
  modules: {
    [name: string]: TypeMetadata[];
  };
  constructFqns: Set<string>;
  view: string;
  modal: boolean;
  selectionIds: string[];
  computed: Computed;
}

export interface ProjectMetadata {
  format: number;
  projectName: string;
  projectId: string;
}

export interface ProjectSettings {
  language: "typescript";
  directoryHandle: FileSystemDirectoryHandle | null;
}

export interface BlueprintMetadata {
  extend: string;
  id: string;
  name: string;
  libs?: { [key: string]: string };
  containers?: string[];
  favorites?: string[];
  rules?: ProjectRules;
}

export interface BlueprintComputed {
  platform: CdkPlatform;
  libs: { [key: string]: string };
  containers: string[];
  favorites: string[];
  rules: ProjectRules;
}

export interface ProjectRules {
  [fqn: string]: {
    allow?: string[];
    deny?: string[];
  };
}

export interface Computed {
  errors: { [valueId: string]: ValueError[] };
  values: { [valueId: string]: ValueMetadata };
  selectedContainer: InstanceValue;
  selectedRootValue: ValueMetadata;
  selectedValue: ValueMetadata | null;
  selection: ValueMetadata[];
  containerPath: ValueMetadata[];
  valuePath: ValueMetadata[];
}
