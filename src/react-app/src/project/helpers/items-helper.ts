import {
  CollectionType,
  ParameterMetadata,
  PropertyMetadata,
  TypeMetadata,
  TypeTest,
} from "../../types";
import { CoreValue, Values } from "../types";
import { TypesHelper } from "./types-helper";

export type ItemType = ParameterMetadata | PropertyMetadata;
const CONSTRUCT_FQN = "constructs.Construct";
const typesHelper = new TypesHelper();

export interface GetItemsResult {
  path: string[];
  required: ItemType[];
  optional: ItemType[];
}

export class ItemsHelper {
  getItems(
    types: {
      [fqn: string]: TypeMetadata;
    },
    value: CoreValue,
    filter: string = ""
  ): GetItemsResult | null {
    let required: ItemType[] = [];
    let optional: ItemType[] = [];

    let all = this.getAllItems(types, value);
    if (!all) return null;

    const path: string[] = [];
    all = this.traversePropertyPath(types, all, path);

    filter = filter.toLowerCase().trim();
    let filtered =
      filter.length > 1
        ? all.filter((c) => c.name.toLowerCase().includes(filter))
        : all;

    required = filtered
      .filter((parameter) => !parameter.optional)
      .sort((a, b) => a.name.localeCompare(b.name));

    optional = filtered
      .filter((parameter) => parameter.optional)
      .sort((a, b) => a.name.localeCompare(b.name));

    return { path, required, optional };
  }

  getAllItems(
    types: {
      [fqn: string]: TypeMetadata;
    },
    value: CoreValue
  ) {
    let all: ItemType[] = [];

    if (Values.isInstance(value)) {
      const typeMetadata = types[value.valueType.fqn];
      all = [...(typeMetadata.initializer || [])].map(this.mapVariadicType);
    } else if (Values.isObject(value)) {
      const typeMetadata = types[value.valueType.fqn];
      all = [...typeMetadata.base.map((fqn) => types[fqn]), typeMetadata]
        .flatMap((type) => type.properties || [])
        .filter((p) => !p.static);
    } else if (Values.isCall(value)) {
      const { methods } = typesHelper.getMethods(value.methodOfType.fqn, types);
      const methodMetadata = methods.find((c) => c.name === value.method);
      if (!methodMetadata) {
        throw new Error(
          `Method ${value.method} not found on ${value.methodOfType.fqn}`
        );
      }

      all = [...(methodMetadata.parameters || [])].map(this.mapVariadicType);
    }

    return all;
  }

  applyScopeLogic(all: ItemType[]) {
    let applied = false;
    if (all.length === 0) return { applied, all };

    const first = all[0];
    const isFirstScope = first.name === "scope";
    const isFirstConstruct =
      TypeTest.isFqn(first.type) && first.type.fqn === CONSTRUCT_FQN;

    const hasId = all.some(
      (c) => TypeTest.isPrimitive(c.type) && c.name === "id"
    );

    if (isFirstScope || (isFirstConstruct && hasId)) {
      all = all.slice(1);
      applied = true;

      if (hasId && all[0].name === "id") {
        all = all.slice(1);
      }
    }

    return { applied, all };
  }

  private traversePropertyPath(
    types: {
      [fqn: string]: TypeMetadata;
    },
    all: ItemType[],
    path: string[]
  ) {
    if (all.length === 0) return all;
    const result = this.applyScopeLogic(all);
    all = result.all;
    let traverse = result.applied && all.length === 1;
    traverse = traverse || (all.length === 1 && all[0].name === "props");

    if (traverse) {
      const current = all[0];
      if (TypeTest.isFqn(current.type)) {
        const typeMetadata = types[current.type.fqn];

        if (typeMetadata.kind === "class") {
          path.push(current.name);
          all = [...(typeMetadata.initializer || [])].map(this.mapVariadicType);
          all = this.traversePropertyPath(types, all, path);
        } else if (typeMetadata.kind === "interface") {
          path.push(current.name);
          all = [...typeMetadata.base.map((fqn) => types[fqn]), typeMetadata]
            .flatMap((type) => type.properties || [])
            .filter((p) => !p.static);
          all = this.traversePropertyPath(types, all, path);
        }
      }
    }

    return all;
  }

  private mapVariadicType(param: ParameterMetadata) {
    if (param.variadic) {
      const array: CollectionType = {
        collection: {
          kind: "array",
          elementtype: param.type,
        },
      };

      return {
        ...param,
        type: array,
      };
    }

    return param;
  }
}
