import { ProjectState } from "../../project/types";
import { Type } from "../../types";
import { Utils } from "../../utils";
import { ValueMetadata, Values } from "../../project/types/values";
import { TypesHelper } from "../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

interface GenerationMetadata {
  variableNames: { [valueId: string]: string };
  containers: { [valueId: string]: string[] };
  parents: { [valueId: string]: string[] };
  parentContainers: { [valueId: string]: string[] };
  containerInRefs: { [valueId: string]: ContainerRef[] };
  containerOutRefs: { [valueId: string]: ContainerRef[] };
  dependsOn: {
    [valueId: string]: string[];
  };
  dependants: {
    [valueId: string]: string[];
  };
}

export interface ContainerRef {
  refValueId: string;
  ownerValueId: string;
  variableName: string;
  ownerVariableName: string;
  refValueType: Type;
}

export abstract class GeneratorBase {
  protected metadata: GenerationMetadata = {
    variableNames: {},
    containers: {},
    parents: {},
    parentContainers: {},
    containerInRefs: {},
    containerOutRefs: {},
    dependsOn: {},
    dependants: {},
  };

  constructor(protected projectState: ProjectState) {
    this.initNames();
    this.buildContainers();
    this.buildParents();
    this.buildDependencies();
    this.buildContainerRefs();
    this.sortContainers();
  }

  abstract constructName(valueName: string): string;

  private initNames() {
    const values = Object.values(this.projectState.computed.values);

    for (const value of values) {
      if (value.valueName) {
        this.metadata.variableNames[value.valueId] = this.constructName(
          value.valueName
        );
      }
    }
  }

  private buildContainers() {
    const containers: { [valueId: string]: string[] } = {};

    for (const item of Object.values(this.projectState.computed.values)) {
      const value = item.value;
      if (
        typesHelper.isContainerType(
          this.projectState.types,
          this.projectState.blueprintComputed,
          value.valueType
        )
      ) {
        containers[item.valueId] = [];
      }
    }

    this.metadata.containers = containers;
  }

  buildParents() {
    for (const value of Object.values(this.projectState.computed.values)) {
      let parents = [];
      let parentId = value.parentId;
      while (parentId) {
        parents.push(parentId);
        parentId = this.projectState.computed.values[parentId].parentId;
      }

      parents = parents.reverse();
      let i = 0;
      let len = parents.length;
      while (i < len && this.metadata.containers.hasOwnProperty(parents[i])) {
        i++;
      }

      const parentContainers = parents.slice(0, i);
      this.metadata.parents[value.valueId] = parents;
      this.metadata.parentContainers[value.valueId] = parentContainers;
    }
  }

  private buildDependencies() {
    const dependsOn: { [valueId: string]: string[] } = {};
    const dependants: { [valueId: string]: string[] } = {};

    for (const item of Object.values(this.projectState.computed.values)) {
      const result = this.valueDeepDependsOn(dependsOn, item, []);
      dependsOn[item.valueId] = result.filter((id) => id !== item.valueId);
    }

    for (const item of Object.values(this.projectState.computed.values)) {
      for (const dependsOnId of dependsOn[item.valueId]) {
        if (!dependants[dependsOnId]) {
          dependants[dependsOnId] = [];
        }

        dependants[dependsOnId].push(item.valueId);
      }
    }

    this.metadata.dependsOn = dependsOn;
    this.metadata.dependants = dependants;
  }

  private valueDeepDependsOn(
    dependsOn: { [valueId: string]: string[] },
    valueMetadata: ValueMetadata,
    visitedIds: string[]
  ): string[] {
    visitedIds.push(valueMetadata.valueId);
    const dependsOnIds = valueMetadata.childrenIds.filter(
      (valueId) => !visitedIds.includes(valueId)
    );

    const dependsOnList = [...visitedIds, ...dependsOnIds];
    const results = dependsOnIds.flatMap((valueId) =>
      dependsOn[valueId]
        ? dependsOn[valueId]
        : this.valueDeepDependsOn(
            dependsOn,
            this.projectState.computed.values[valueId],
            visitedIds
          )
    );

    let refDependOnIds: string[] = [];
    if (Values.isRef(valueMetadata.value)) {
      const refValueId = valueMetadata.value.refValueId;
      const refValueMetadata = this.projectState.computed.values[refValueId];
      visitedIds.push(refValueId);
      const { value1Parents } = this.getParentListDiff(
        refValueMetadata.valueId,
        valueMetadata.valueId,
        false
      );

      refDependOnIds = [
        refValueId,
        ...value1Parents,
        ...(dependsOn[refValueId]
          ? dependsOn[refValueId]
          : this.valueDeepDependsOn(dependsOn, refValueMetadata, visitedIds)),
      ];
    } else if (
      Values.isCall(valueMetadata.value) &&
      valueMetadata.value.methodOfId
    ) {
      const methodOfValueMetadata =
        this.projectState.computed.values[valueMetadata.value.methodOfId];

      if (this.metadata.containers[methodOfValueMetadata.valueId]) {
        refDependOnIds = [valueMetadata.value.methodOfId];
      } else {
        refDependOnIds = [
          valueMetadata.value.methodOfId,
          ...(dependsOn[valueMetadata.value.methodOfId]
            ? dependsOn[valueMetadata.value.methodOfId]
            : this.valueDeepDependsOn(
                dependsOn,
                methodOfValueMetadata,
                visitedIds
              )),
        ];
      }
    }

    const ids = [...dependsOnList, ...refDependOnIds, ...results];
    return Utils.unique(ids);
  }

  buildContainerRefs() {
    const values = Object.values(this.projectState.computed.values);

    for (const container of Object.keys(this.metadata.containers)) {
      this.metadata.containerInRefs[container] = [];
      this.metadata.containerOutRefs[container] = [];
    }

    for (const value of values) {
      if (!Values.isRef(value.value)) continue;
      const refValueId = value.value.refValueId;
      const valueId = value.valueId;

      const { value1Parents: refValueParents, value2Parents: valueParents } =
        this.getParentListDiff(refValueId, valueId, true);
      if (refValueParents.length === 0 && valueParents.length === 0) continue;

      const variableName = this.metadata.variableNames[refValueId];
      const refValue = this.projectState.computed.values[refValueId];
      const refValueType = refValue.value.valueType;

      let len = refValueParents.length;
      for (let i = 0; i < len; i++) {
        const parent = refValueParents[i];
        const existing = this.metadata.containerOutRefs[parent].find(
          (c) => c.refValueId === refValueId
        );

        if (existing) continue;
        const ownerValueId = i < len - 1 ? refValueParents[i + 1] : refValueId;
        const ownerVariableName = this.metadata.variableNames[ownerValueId];
        this.metadata.containerOutRefs[parent].push({
          refValueId,
          ownerValueId,
          variableName,
          ownerVariableName,
          refValueType,
        });
      }

      len = valueParents.length;
      for (let i = 0; i < len; i++) {
        const parent = valueParents[i];
        const existing = this.metadata.containerInRefs[parent].find(
          (c) => c.refValueId === refValueId
        );

        if (existing) continue;
        const ownerValueId =
          i !== 0
            ? refValueParents[i - 1]
            : refValueParents.length > 0
            ? refValueParents[0]
            : refValueId;

        const ownerVariableName = this.metadata.variableNames[ownerValueId];
        this.metadata.containerInRefs[parent].push({
          refValueId,
          ownerValueId,
          variableName,
          ownerVariableName,
          refValueType,
        });
      }
    }

    for (const container of Object.keys(this.metadata.containers)) {
      this.metadata.containerInRefs[container] = this.metadata.containerInRefs[
        container
      ].sort((a, b) => a.variableName.localeCompare(b.variableName));

      this.metadata.containerOutRefs[container] =
        this.metadata.containerOutRefs[container].sort((a, b) =>
          a.variableName.localeCompare(b.variableName)
        );
    }
  }

  private sortContainers() {
    for (const containerId of Object.keys(this.metadata.containers)) {
      const container = this.projectState.computed.values[containerId];
      if (!Values.isInstance(container.value)) continue;

      const sorted = this.sortValues(
        container.value.children.map((c) => c.valueId) || [],
        this.metadata.dependsOn
      );

      this.metadata.containers[containerId] = sorted;
    }
  }

  private sortValues(
    valueIds: string[],
    dependsOn: {
      [valueId: string]: string[];
    }
  ) {
    let limit = 10000;

    while (limit > 0) {
      let moves = 0;

      for (const valueId of valueIds) {
        const idx = valueIds.indexOf(valueId);
        const depends = dependsOn[valueId];

        for (const current of valueIds) {
          if (current === valueId) continue;
          const currentIdx = valueIds.indexOf(current);
          if (currentIdx < idx) continue;
          const currentDepends = dependsOn[current];

          if (depends.includes(current)) {
            if (currentDepends.includes(valueId)) {
              const loop1 = this.projectState.computed.values[valueId];
              const loop2 = this.projectState.computed.values[current];

              console.log(`Loop: ${loop1.valueName} <-> ${loop2.valueName}`);
            } else {
              Utils.moveArrayElement(valueIds, current, idx - currentIdx);
              moves += 1;
            }
          }
        }
      }

      if (moves === 0) {
        break;
      }

      limit--;
    }

    if (limit <= 0) {
      throw new Error("Infinite loop detected");
    }

    return valueIds;
  }

  protected getParentListDiff(
    value1Id: string,
    value2Id: string,
    containersOnly: boolean
  ) {
    const value1Parents = containersOnly
      ? this.metadata.parentContainers[value1Id]
      : this.metadata.parents[value1Id];
    const value2Parents = containersOnly
      ? this.metadata.parentContainers[value2Id]
      : this.metadata.parents[value2Id];

    const min = Math.min(value1Parents.length, value2Parents.length);
    let i = 0;
    while (i < min && value1Parents[i] === value2Parents[i]) {
      i++;
    }

    return {
      value1Parents: value1Parents.slice(i),
      value2Parents: value2Parents.slice(i),
    };
  }
}
