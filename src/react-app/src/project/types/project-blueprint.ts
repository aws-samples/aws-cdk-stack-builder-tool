import { InstanceValue } from "./values";
import { CdkPlatform, ProjectRules } from "./project-state";

export interface BlueprintExtend {
  platform: CdkPlatform;
  libs: { [key: string]: string };
  containers: string[];
  favorites: string[];
  rules: ProjectRules;
}

//https://base64.guru/converter/encode/image/svg
export interface ProjectBlueprint {
  kind: "cdk/project-blueprint";
  format: number;
  extend: string;
  id: string;
  name: string;
  description: string;
  icon?: string;
  background: string;
  libs?: { [key: string]: string };
  containers?: string[];
  favorites?: string[];
  rules?: ProjectRules;
  root: InstanceValue;
}
