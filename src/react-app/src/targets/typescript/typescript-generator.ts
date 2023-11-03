import prettier from "prettier/standalone";
import parserTypeScript from "prettier/parser-typescript";
import { ParameterMetadata, Type, TypeTest } from "../../types";
import {
  InstanceValue,
  ValueMetadata,
  Values,
} from "../../project/types/values";
import { CodeGenerator } from "../generation/code-generator";
import { Utils } from "../../utils";
import { TypesHelper } from "../../project/helpers/types-helper";

const typesHelper = new TypesHelper();

export class TypeScriptGenerator extends CodeGenerator {
  buildContainer(valueId: string, isRoot: boolean) {
    const container = this.state.containers[valueId];

    const items = this.metadata.containers[valueId].map(
      (id) => this.projectState.computed.values[id]
    );

    const containerValueMetatdata = this.projectState.computed.values[valueId];
    const containerValue = containerValueMetatdata.value;
    if (!Values.isInstance(containerValue)) {
      throw new Error("Expected instance value");
    }

    const {
      code: result,
      fqns,
      containerIds,
    } = isRoot
      ? this.buildRootContainer(containerValue, items)
      : this.buildContainerClass(containerValue, items);

    container.fqns = Utils.unique(fqns);
    container.containerIds = Utils.unique(containerIds);

    const imports = this.buildImports(
      isRoot,
      container.fqns,
      container.containerIds
    );

    let code = [...imports, "", ...result].join("\n");

    try {
      code = prettier.format(code, {
        parser: "typescript",
        plugins: [parserTypeScript],
        printWidth: 80,
        tabWidth: 2,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof SyntaxError) {
        code = `// Error formatting code\n/*${error.message}*/\n\n${code}`;
      } else {
        code = `// Error formatting code\n\n${code}`;
      }
    }

    container.code = code;
  }

  buildRootContainer(container: InstanceValue, items: ValueMetadata[]) {
    const appVariableName = this.metadata.variableNames[container.valueId];
    const valueMetadata = this.projectState.computed.values[container.valueId];

    const fqns: string[] = [container.valueType.fqn];
    const containerIds: string[] = [];

    const { children } = this.getChildren(
      this.projectState.computed.values[container.valueId],
      appVariableName
    );

    let rootParams = Object.values(children)
      .filter((c) => !/^[\d]*$/.test(c.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => `${c.name}: ${c.value}`)
      .join(",");

    if (rootParams.length > 0) {
      rootParams = `{${rootParams}}`;
    }

    const fullTypeName = this.fullTypeName(valueMetadata.value.valueType);
    const code = [
      `const ${appVariableName} = new ${fullTypeName}(${rootParams});`,
      "",
    ];

    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const {
          code: result,
          fqns: resultFqns,
          containerIds: resultContainerIds,
        } = this.buildValue(item, appVariableName);

        code.push(`${result};`);
        fqns.push(...resultFqns);
        containerIds.push(...resultContainerIds);

        if (i < items.length - 1) {
          code.push("");
        }
      }
    }

    return { code, fqns, containerIds };
  }

  buildContainerClass(container: InstanceValue, items: ValueMetadata[]) {
    const valueName = this.valueName(container.valueName);
    const fqns: string[] = [container.valueType.fqn];
    const containerIds: string[] = [];

    const containerFullTypeName = this.fullTypeName(container.valueType);
    const containerType = this.projectState.types[container.valueType.fqn];
    const constructorCode: string[] = [];
    const clsCode: string[] = [];
    const clsPropsCode: string[] = [];
    const propsSetCode: string[] = [];

    if (items.length > 0) {
      constructorCode.push("");

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const {
          code: result,
          fqns: resultFqns,
          containerIds: resultContainerIds,
        } = this.buildValue(item, "this");

        constructorCode.push(`${result};`);
        fqns.push(...resultFqns);
        containerIds.push(...resultContainerIds);

        if (i < items.length - 1) {
          constructorCode.push("");
        }
      }
    }

    const refsIn = this.metadata.containerInRefs[container.valueId];
    const refsOut = this.metadata.containerOutRefs[container.valueId];

    let propsFullTypeName: string | null = null;
    const propsParamType = (containerType.initializer || []).find(
      (c) => c.name === "props"
    )?.type;

    if (propsParamType && TypeTest.isFqn(propsParamType)) {
      propsFullTypeName = this.fullTypeName(propsParamType);
    }

    if (refsOut.length > 0) {
      propsSetCode.push("");

      for (const ref of refsOut) {
        if (TypeTest.isFqn(ref.refValueType)) {
          fqns.push(ref.refValueType.fqn);
        }

        const fullTypeName = this.fullTypeName(ref.refValueType);
        clsPropsCode.push(`public ${ref.variableName}: ${fullTypeName}`);

        if (ref.refValueId !== ref.ownerValueId) {
          propsSetCode.push(
            `this.${ref.variableName} = ${ref.ownerVariableName}.${ref.variableName};`
          );
        } else {
          propsSetCode.push(`this.${ref.variableName} = ${ref.variableName};`);
        }
      }

      clsPropsCode.push("");
    }

    if (refsIn.length > 0) {
      clsCode.push(
        `export interface ${valueName}Props extends ${propsFullTypeName} {`
      );

      for (const ref of refsIn) {
        if (TypeTest.isFqn(ref.refValueType)) {
          fqns.push(ref.refValueType.fqn);
        }

        const fullTypeName = this.fullTypeName(ref.refValueType);
        clsCode.push(`${ref.variableName}: ${fullTypeName}`);
      }

      clsCode.push("}");
      clsCode.push("");

      clsCode.push(
        `export class ${valueName} extends ${containerFullTypeName} {`,
        ...clsPropsCode,
        `constructor(scope: Construct, id: string, props: ${valueName}Props) {`,
        `super(scope, id, props);`
      );
    } else {
      if (propsFullTypeName) {
        clsCode.push(
          `export class ${valueName} extends ${containerFullTypeName} {`,
          ...clsPropsCode,
          `constructor(scope: Construct, id: string, props?: ${propsFullTypeName}) {`,
          `super(scope, id, props);`
        );
      } else {
        clsCode.push(
          `export class ${valueName} extends ${containerFullTypeName} {`,
          ...clsPropsCode,
          `constructor(scope: Construct, id: string) {`,
          `super(scope, id);`
        );
      }
    }

    return {
      code: [...clsCode, ...constructorCode, ...propsSetCode, "}}"],
      fqns,
      containerIds,
    };
  }

  buildValue(item: ValueMetadata, scope: string) {
    const isContainer =
      typeof this.metadata.containers[item.valueId] !== "undefined";

    const {
      children,
      fqns: resultFqns,
      containerIds: resultContainerIds,
    } = this.getChildren(item, scope);

    const variableStr = this.getVariableName(item);
    const code: string[] = [];
    const fqns: string[] = [];
    const containerIds: string[] = [];

    if (!isContainer) {
      fqns.push(...resultFqns);
      containerIds.push(...resultContainerIds);
    } else {
      containerIds.push(item.valueId);
    }

    if (Values.isObject(item.value)) {
      code.push(
        `{${children.map((val) => `${val.name}: ${val.value}`).join(",")}}`
      );
    } else if (Values.isInstance(item.value)) {
      const fqn = item.value.valueType.fqn;
      const type = this.projectState.types[fqn];
      const fullTypeName = this.fullTypeName(item.value.valueType);
      fqns.push(fqn);

      const valueName = this.valueName(item.value.valueName);
      if (isContainer) {
        this.buildContainer(item.valueId, false);
        const refsIn = this.metadata.containerInRefs[item.valueId];
        const refsInVals = refsIn.map((ref) => {
          const ownerVariableName =
            this.metadata.variableNames[ref.ownerValueId];

          if (this.metadata.containers[ref.ownerValueId]) {
            return {
              name: ref.variableName,
              value: `${ownerVariableName}.${ref.variableName}`,
            };
          } else {
            return {
              name: ref.variableName,
              value: `${ref.variableName}`,
            };
          }
        });

        const params = this.getParameters(
          type.initializer || [],
          children.filter((c) => !Utils.isNumeric(c.name)),
          valueName,
          scope,
          refsInVals
        );

        code.push(`${variableStr}new ${valueName}(${params})`);
      } else {
        const params = this.getParameters(
          type.initializer || [],
          children,
          valueName,
          scope
        );

        code.push(`${variableStr}new ${fullTypeName}(${params})`);
      }
    } else if (Values.isPrimitive(item.value)) {
      if (typeof item.value.value === "string") {
        code.push(`"${item.value.value.toString().replaceAll('"', '\\"')}"`);
      } else {
        code.push(item.value.value.toString());
      }
    } else if (Values.isMember(item.value)) {
      const fqn = item.value.valueType.fqn;
      const fullTypeName = this.fullTypeName(item.value.valueType);

      fqns.push(fqn);
      code.push(`${fullTypeName}.${item.value.member}`);
    } else if (Values.isProperty(item.value)) {
      if (item.value.propertyOfId) {
        const variable = this.metadata.variableNames[item.value.propertyOfId];
        if (variable) {
          code.push(`${variable}.${item.value.property}`);
        }
      } else if (item.value.propertyOfType) {
        const fqn = item.value.propertyOfType.fqn;
        const fullTypeName = this.fullTypeName(item.value.propertyOfType);

        fqns.push(fqn);
        code.push(`${fullTypeName}.${item.value.property}`);
      }
    } else if (Values.isCall(item.value)) {
      const methodName = item.value.method;
      let methodPath = item.value.methodPath.join(".");
      if (methodPath.length > 0) {
        methodPath = methodPath + ".";
      }

      const methodOfId = item.value.methodOfId;
      if (methodOfId) {
        const variable = this.metadata.variableNames[methodOfId];
        const valueName = this.valueName(item.value.valueName);

        if (variable) {
          const { methods } = typesHelper.getMethods(
            item.value.methodOfType.fqn,
            this.projectState.types
          );
          const method = methods.find((c) => c.name === methodName);
          const params = this.getParameters(
            method?.parameters || [],
            children,
            valueName,
            scope
          );

          code.push(
            `${variableStr}${variable}.${methodPath}${item.value.method}(${params})`
          );
        }
      } else if (item.value.methodOfType) {
        const fqn = item.value.methodOfType.fqn;
        const fullTypeName = this.fullTypeName(item.value.methodOfType);
        const valueName = this.valueName(item.value.valueName);
        fqns.push(fqn);

        const { methods } = typesHelper.getMethods(
          item.value.methodOfType.fqn,
          this.projectState.types
        );

        const method = methods.find((c) => c.name === methodName);
        const params = this.getParameters(
          method?.parameters || [],
          children,
          valueName,
          scope
        );

        code.push(
          `${variableStr}${fullTypeName}.${methodPath}${item.value.method}(${params})`
        );
      }
    } else if (Values.isArray(item.value)) {
      code.push(`[${children.map((val) => val.value).join(",")}]`);
    } else if (Values.isMap(item.value)) {
      code.push(
        `{${children.map((val) => `"${val.name}": ${val.value}`).join(",")}}`
      );
    } else if (Values.isRef(item.value)) {
      const refValueId = item.value.refValueId;
      const variableName = this.metadata.variableNames[refValueId];
      const valueContainers = this.metadata.parentContainers[item.valueId];
      const refContainers = this.metadata.parentContainers[refValueId];
      const containerId = valueContainers[valueContainers.length - 1];
      const refContainerId = refContainers[refContainers.length - 1];

      if (containerId !== refContainerId) {
        const inRef = this.metadata.containerInRefs[containerId].find(
          (c) => c.refValueId === refValueId
        );

        if (inRef) {
          code.push(`props.${variableName}`);
        } else {
          const { value1Parents } = this.getParentListDiff(
            refValueId,
            item.valueId,
            true
          );

          if (value1Parents.length === 0) {
            throw new Error(`Unable to getParentListDiff for ${refValueId}`);
          }

          const refContainerVariableName =
            this.metadata.variableNames[value1Parents[0]];
          code.push(`${refContainerVariableName}.${variableName}`);
        }
      } else {
        code.push(variableName);
      }
    } else {
      code.push(JSON.stringify(item.value));
    }

    return { code: code.join("\n"), fqns, containerIds };
  }

  getParameters(
    parameters: ParameterMetadata[],
    values: {
      name: string;
      value: string;
    }[],
    valueName: string | undefined,
    scope: string,
    additionalProps?: {
      name: string;
      value: string;
    }[]
  ) {
    const retValue: string[] = [];
    let hasScope = false;

    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const isScope =
        i === 0 &&
        (param.name === "scope" ||
          (TypeTest.isFqn(param.type) &&
            param.type.fqn === "constructs.Construct"));

      if (isScope) {
        retValue.push(scope ?? "this");
        hasScope = true;
      } else if (hasScope && param.name === "id") {
        retValue.push(`"${valueName}"`);
      } else {
        const current = values.find((c) => c.name === param.name);

        if (
          param.name === "props" &&
          additionalProps &&
          additionalProps.length > 0
        ) {
          let currentValue = current?.value || "{}";
          currentValue = currentValue
            .substring(1, currentValue.length - 1)
            .trim();

          const additionalValue = additionalProps
            .map((c) =>
              c.name !== c.value ? `${c.name}: ${c.value}` : c.value
            )
            .join(",");

          retValue.push(
            `{${currentValue}${
              currentValue.length > 0 ? "," : ""
            }${additionalValue}}`
          );
        } else if (current) {
          if (
            param.variadic &&
            current.value.startsWith("[") &&
            current.value.endsWith("]")
          ) {
            retValue.push(current.value.substring(1, current.value.length - 1));
          } else {
            retValue.push(current.value);
          }
        } else if (!param.optional) {
          if (TypeTest.isFqn(param.type)) {
            const typeMetadata = this.projectState.types[param.type.fqn];
            if (typeMetadata.kind === "interface") {
              retValue.push("{}");
            }
          }
        }
      }
    }

    return retValue.join(",");
  }

  getVariableName(item: ValueMetadata) {
    let variableStr = "";
    const variableName = this.metadata.variableNames[item.valueId];
    const dependants = (this.metadata.dependants[item.valueId] || []).filter(
      (valueId) => {
        const item = this.projectState.computed.values[valueId];
        if (this.metadata.containers[item.valueId]) {
          return false;
        }

        return true;
      }
    );

    const hasOut =
      this.metadata.containerOutRefs[item.valueId] &&
      this.metadata.containerOutRefs[item.valueId].length > 0;

    if (variableName && (dependants.length > 0 || hasOut)) {
      variableStr = `const ${variableName} = `;
    }

    return variableStr;
  }

  getChildren(item: ValueMetadata, scope: string) {
    const items = item.childrenIds.map(
      (c) => this.projectState.computed.values[c]
    );

    const children: { name: string; value: string }[] = [];
    const fqns: string[] = [];
    const containerIds: string[] = [];

    for (const current of items) {
      const {
        code,
        fqns: resultFqns,
        containerIds: resultContainerIds,
      } = this.buildValue(current, scope);

      fqns.push(...resultFqns);
      containerIds.push(...resultContainerIds);

      children.push({
        name: current.parentKey,
        value: code,
      });
    }

    return {
      children: children.sort((a, b) => a.name.localeCompare(b.name)),
      fqns,
      containerIds,
    };
  }

  buildImports(isRoot: boolean, fqns: string[], containerIds: string[]) {
    const aliases: {
      [alias: string]: string;
    } = {};

    for (const fqn of fqns) {
      const typeMetadata = this.projectState.types[fqn];
      const aliasArr = this.moduleCodeAliasArray(typeMetadata.modules);
      const alias = aliasArr.length > 0 ? aliasArr[0] : "";
      const importName = this.importName(fqn);
      aliases[alias] = importName;
    }

    let imports: string[] = [];
    for (const alias of Object.keys(aliases)) {
      imports.push(`import * as ${alias} from "${aliases[alias]}";`);
    }

    for (const current of containerIds
      .map((c) => this.projectState.computed.values[c])
      .sort((a, b) => (a.valueName || "").localeCompare(b.valueName || ""))) {
      const container = this.state.containers[current.valueId];

      imports.push(
        `import {${this.valueName(current.valueName)}} from "../lib/${
          container.fileName
        }";`
      );
    }

    const required = isRoot
      ? ["#!/usr/bin/env node", "import 'source-map-support/register';"]
      : [`import { Construct } from "constructs";`];

    imports = Utils.unique([...required, ...imports.sort()]);

    return imports;
  }

  constructName(valueName: string): string {
    if (valueName === valueName.toUpperCase()) {
      valueName = valueName.toLowerCase();
    }

    return valueName
      .split(/[\s-_]+/)
      .map((c) => c.trim())
      .filter((c) => c)
      .map((c, i) =>
        i > 0
          ? c.charAt(0).toUpperCase() + c.slice(1)
          : c.charAt(0).toLocaleLowerCase() + c.slice(1)
      )
      .join("");
  }

  containerFileName(valueName: string): string {
    const name: string[] = [];
    let acc = "";
    let prev = "";

    for (let i = 0; i < valueName.length; i++) {
      const c = valueName[i];
      if (
        c === c.toUpperCase() &&
        c !== c.toLowerCase() &&
        prev === prev.toLowerCase() &&
        prev !== prev.toUpperCase()
      ) {
        if (acc) name.push(acc.toLowerCase());
        acc = "";
      }

      acc += c;
      prev = c;
    }

    if (acc) name.push(acc.toLowerCase());

    let retValue = name.join("-").replaceAll("_", "-");

    const has = (fileName: string) =>
      Object.values(this.state.containers).find((c) => c.fileName === fileName);
    if (has(retValue)) {
      for (let i = 1; i <= 10000; i++) {
        if (!has(retValue + i.toString())) {
          retValue = retValue + i.toString();
          break;
        }
      }
    }

    return retValue;
  }

  valueName(valueName: string = "") {
    return Utils.firstLetterToUpperCase(valueName);
  }

  fullTypeName(type: Type) {
    if (TypeTest.isFqn(type)) {
      const typeMetadata = this.projectState.types[type.fqn];
      const alias = this.moduleCodeAliasArray(typeMetadata.modules);

      return `${alias.join(".")}.${typeMetadata.name}`;
    }

    return "undefined";
  }

  // transform @aws-cdk_aws-batch-alpha.ComputeEnvironment to
  // @aws-cdk_aws/batch-alpha
  importName(fqn: string) {
    const importName = fqn
      .replaceAll(".", "/")
      .split("/")
      .slice(0, -1)
      .join("/")
      .replaceAll("_", "-");

    return importName;
  }

  moduleCodeAliasArray(modules: string[]) {
    const aliases = modules.map((module) => {
      if (module === "aws-cdk-lib") return "cdk";

      return module
        .replaceAll("_", "-")
        .replace("aws-", "")
        .split("-")
        .map((c, i) => (i > 0 ? c.charAt(0).toUpperCase() + c.slice(1) : c))
        .join("");
    });

    return aliases;
  }
}
