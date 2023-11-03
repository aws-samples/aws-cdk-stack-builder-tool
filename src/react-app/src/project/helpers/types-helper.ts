import Prism from "prismjs";
import {
  Computed,
  CoreValue,
  ProjectState,
  BlueprintComputed,
  Values,
} from "../types";
import {
  FqnType,
  MethodMetadata,
  ParameterMetadata,
  PropertyMetadata,
  Type,
  TypeMetadata,
  TypeTest,
} from "../../types";
import { Utils } from "../../utils";

export interface Targets {
  properties: { fqn: string; name: string }[];
  constructs: { fqn: string }[];
  classes: { fqn: string }[];
  interfaces: { fqn: string }[];
  methods: { fqn: string; name: string }[];
  items: { fqn: string; valueId: string }[];
}

export class TypesHelper {
  applyRules(state: ProjectState, containerFqn: string, fqn: string) {
    const rules = state.blueprintComputed.rules;

    let containerRules = rules[containerFqn] || rules["*"];
    if (!containerRules) {
      return true;
    }

    const allow = containerRules.allow || [];
    if (allow.includes("*") || allow.includes(fqn)) {
      return true;
    }

    const deny = containerRules.deny || [];
    if (deny.includes("*") || deny.includes(fqn)) {
      return false;
    }

    return true;
  }

  getCommentText(item: PropertyMetadata | ParameterMetadata) {
    let text = item.docs?.summary || "";

    if (item.docs?.default && item.docs.default.length > 0) {
      text += `\n\n@default\n${item.docs.default}`;
    }

    const retValue = Prism.highlight(
      text,
      Prism.languages.markdown,
      "markdown"
    );

    return retValue;
  }

  getMethods(fqn: string, types: { [fqn: string]: TypeMetadata }) {
    const typeMetadata = types[fqn];
    let methods: { [name: string]: MethodMetadata } = {};
    const typeFqns = [typeMetadata.fqn, ...typeMetadata.base];

    for (const fqn of typeFqns) {
      const typeMetadta = types[fqn];

      for (const method of typeMetadta.methods || []) {
        if (typeof methods[method.name] === "undefined") {
          methods[method.name] = method;
        }
      }
    }

    const values = Object.values(methods);
    values.sort((a, b) => a.name.localeCompare(b.name));

    return {
      typeMetadata,
      methods: values,
    };
  }

  getTargets(
    type: FqnType | FqnType[],
    computed: Computed,
    types: { [fqn: string]: TypeMetadata },
    constructFqns: Set<string>
  ) {
    const targets: Targets = {
      constructs: [],
      classes: [],
      interfaces: [],
      properties: [],
      methods: [],
      items: [],
    };

    if (!Array.isArray(type)) {
      type = [type];
    }

    for (const current of type) {
      const fqn = current.fqn;
      const typeMetadata = types[fqn];
      const all = [
        typeMetadata,
        ...(typeMetadata.sub || []).map((fqn) => types[fqn]),
      ];

      targets.constructs.push(
        ...all
          .filter(
            (t) =>
              t.kind === "class" &&
              constructFqns.has(t.fqn) &&
              !t.abstract &&
              t.initializer
          )
          .map((c) => ({ fqn: c.fqn }))
      );

      targets.classes.push(
        ...all
          .filter(
            (t) =>
              t.kind === "class" &&
              !constructFqns.has(t.fqn) &&
              !t.abstract &&
              t.initializer
          )
          .map((c) => ({ fqn: c.fqn }))
      );

      targets.interfaces.push(
        ...all
          .filter((t: TypeMetadata) => {
            if (t.kind !== "interface") {
              return false;
            }

            return !(
              t.name.length > 1 &&
              t.name.startsWith("I") &&
              Utils.isUpperCase(t.name[1])
            );
          })
          .map((c) => ({ fqn: c.fqn }))
      );

      const sources = typeMetadata.sources || [];
      targets.properties.push(
        ...sources
          .filter((c) => c.kind === "property")
          .map((c) => ({ name: c.name, fqn: c.fqn }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      targets.methods.push(
        ...sources
          .filter((c) => c.kind === "method")
          .map((c) => ({ name: c.name, fqn: c.fqn }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      for (const item of Object.values(computed.values)) {
        if (!Values.isInstance(item.value)) continue;
        if (!item.value.valueName) continue;

        if (
          item.value.valueType.fqn === fqn ||
          types[item.value.valueType.fqn].base.includes(fqn)
        ) {
          targets.items.push({
            fqn: item.value.valueType.fqn,
            valueId: item.valueId,
          });
        }
      }
    }

    if (type.length > 1) {
      targets.constructs = Utils.unique(targets.constructs).sort((a, b) =>
        a.fqn.localeCompare(b.fqn)
      );
      targets.classes = Utils.unique(targets.classes).sort((a, b) =>
        a.fqn.localeCompare(b.fqn)
      );
      targets.interfaces = Utils.unique(targets.interfaces).sort((a, b) =>
        a.fqn.localeCompare(b.fqn)
      );
      targets.properties = Utils.unique(targets.properties).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      targets.methods = Utils.unique(targets.methods).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      targets.items = Utils.unique(targets.items).sort((a, b) =>
        a.fqn.localeCompare(b.fqn)
      );
    }

    return targets;
  }

  getTypeName(state: ProjectState, value: CoreValue) {
    let typeName = "";

    if (Values.isCall(value)) {
      if (value.methodOfId) {
        const val = state.computed.values[value.methodOfId];
        let methodPath = value.methodPath.join(".");
        if (methodPath.length > 0) {
          methodPath = methodPath + ".";
        }
        typeName = `${val?.valueName}.${methodPath}${value.method}(...)`;
      } else {
        const typeMetadata = state.types[value.methodOfType.fqn];
        typeName = typeMetadata
          ? `${typeMetadata.modules.join(".")}.${typeMetadata.name}.${
              value.method
            }(...)`
          : `N/A: ${value.methodOfType.fqn}`;
      }
    } else if (TypeTest.isFqn(value.valueType)) {
      const typeMetadata = state.types[value.valueType.fqn];
      typeName = typeMetadata
        ? `${typeMetadata.modules.join(".")}.${typeMetadata.name}`
        : `N/A: ${value.valueType.fqn}`;
    } else if (TypeTest.isPrimitive(value.valueType)) {
      typeName = value.valueType.primitive;
    } else {
      typeName = "unknown";
    }

    return typeName;
  }

  isConstruct(
    type: Type,
    types: { [fqn: string]: TypeMetadata },
    constructFqns: Set<string>
  ) {
    let hasIdParam = false;
    let construct = false;

    if (TypeTest.isFqn(type)) {
      const typeMetdata = types[type.fqn];

      if (typeMetdata) {
        const initializer = types[type.fqn].initializer;
        if (initializer && initializer.find((c) => c.name === "id")) {
          hasIdParam = true;
        }

        if (constructFqns.has(typeMetdata.fqn)) {
          construct = true;
        } else {
          const allTypes = [...typeMetdata.base, ...(typeMetdata.sub || [])];
          for (const type of allTypes) {
            if (constructFqns.has(type)) {
              construct = true;
              break;
            }
          }
        }
      }
    }

    return { construct, hasIdParam };
  }

  isContainerType(
    types: { [fqn: string]: TypeMetadata },
    blueprintComputed: BlueprintComputed,
    type: Type
  ) {
    if (!TypeTest.isFqn(type)) {
      return false;
    }

    if (blueprintComputed.containers.includes(type.fqn)) {
      return true;
    }

    const typeMetadata = types[type.fqn];
    if (typeMetadata) {
      for (const item of typeMetadata.base) {
        if (blueprintComputed.containers.includes(item)) {
          return true;
        }
      }
    }

    return false;
  }
}
