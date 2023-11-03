import { ProjectState } from "../../project/types";
import { Utils } from "../../utils";
import { GeneratorBase } from "./generator-base";

export interface GenerationState {
  fqns: string[];
  containers: {
    [valueId: string]: ContainerState;
  };
}

export interface ContainerState {
  isRoot: boolean;
  fileName: string;
  valueName: string;
  variableName: string;
  fqns: string[];
  containerIds: string[];
  code: string;
}

export abstract class CodeGenerator extends GeneratorBase {
  protected state: GenerationState = {
    fqns: [],
    containers: {},
  };

  constructor(protected projectState: ProjectState) {
    super(projectState);
  }

  abstract buildContainer(valueId: string, isRoot: boolean): void;
  abstract moduleCodeAliasArray(modules: string[]): string[];
  abstract containerFileName(valueName: string): string;
  abstract valueName(valueName: string | undefined): string;

  generate(): GenerationState {
    const containerIds = Object.keys(this.metadata.containers);
    const rootId = this.projectState.root.valueId;
    for (const containerId of containerIds) {
      const container = this.projectState.computed.values[containerId];
      const fileName = this.containerFileName(container.valueName || "null");
      const variableName = this.metadata.variableNames[container.valueId];
      const valueName = this.valueName(container.valueName);

      this.state.containers[containerId] = {
        isRoot: containerId === rootId,
        fqns: [],
        containerIds: [],
        code: "",
        valueName,
        fileName,
        variableName,
      };
    }

    this.buildContainer(rootId, true);
    const allFqns = Object.values(this.state.containers).flatMap((v) => v.fqns);
    this.state.fqns = Utils.unique(allFqns);

    return this.state;
  }
}
