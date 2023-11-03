import { InstanceValue } from "./values";

export interface StorageV1Data {
  kind: "cdk/project";
  metadata: StorageV1Metadata;
  settings: StorageV1Settings;
  timestamp: number;
  blueprint: StorageV1Blueprint;
  root: InstanceValue;
  libs: { [key: string]: string };
}

export interface StorageV1Metadata {
  format: number;
  projectName: string;
  projectId: string;
}

export interface StorageV1Settings {
  language: "typescript";
  directoryHandle: FileSystemDirectoryHandle | null;
}

export interface StorageV1Blueprint {
  extend: string;
  id: string;
  name: string;
  libs?: { [key: string]: string };
  containers?: string[];
  favorites?: string[];
  rules?: StorageV1Rules;
}

export interface StorageV1Rules {
  [fqn: string]: {
    allow?: string[];
    deny?: string[];
  };
}
