export const FORMAT_VERSION = 1;

export interface CoreData {
  format: number;
  version: string;
  files: string[];
  assemblies: AssemblyMetadata[];
}

export interface AssemblyMetadata {
  name: string;
  version: string;
  dependencies: { [name: string]: string };
}

export interface TypeMetadata {
  kind: "class" | "interface" | "enum";
  fqn: string;
  abstract: boolean;
  assembly: string;
  modules: string[];
  name: string;
  base: string[];
  sub?: string[];
  initializer?: ParameterMetadata[];
  members?: MemberMetadata[];
  properties?: PropertyMetadata[];
  methods?: MethodMetadata[];
  sources?: TypeSource[];
}

export interface TypeSource {
  kind: "property" | "method";
  name: string;
  fqn: string;
}

export interface MemberMetadata {
  name: string;
}

export interface NamedType {
  name: string;
  type: Type;
}

export interface PropertyMetadata extends NamedType {
  optional: boolean;
  static: boolean;
  docs?: DocsMetadata;
}

export interface ParameterMetadata extends NamedType {
  optional: boolean;
  variadic: boolean;
  docs?: DocsMetadata;
}

export interface MethodMetadata {
  name: string;
  static: boolean;
  parameters: ParameterMetadata[];
  returns?: Type;
}

export interface DocsMetadata {
  summary: string;
  default?: string;
  see?: string;
  link?: string;
}

export type Type = UnionType | PrimitiveType | FqnType | CollectionType;

export interface UnionType {
  union: {
    types: Type[];
  };
}

export interface PrimitiveType {
  primitive:
    | "number"
    | "string"
    | "boolean"
    | "bigint"
    | "symbol"
    | "any"
    | "null"
    | "undefined";
}

export interface FqnType {
  fqn: string;
}

export interface CollectionType {
  collection: {
    kind: "map" | "array";
    elementtype: Type;
  };
}

export class TypeTest {
  static isUnion(object: Type): object is UnionType {
    return typeof (object as UnionType).union !== "undefined";
  }

  static isPrimitive(object: Type): object is PrimitiveType {
    return typeof (object as PrimitiveType).primitive !== "undefined";
  }

  static isFqn(object: Type): object is FqnType {
    return typeof (object as FqnType).fqn !== "undefined";
  }

  static isCollection(object: Type): object is CollectionType {
    return typeof (object as CollectionType).collection !== "undefined";
  }
}
